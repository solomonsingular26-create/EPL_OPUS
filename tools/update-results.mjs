#!/usr/bin/env node
/* =====================================================================
   AUTO RESULTS  —  football-data.org  ->  Firestore `matches`

   Pulls every FINISHED Premier League game from football-data.org and
   writes home_score / away_score / finished onto the matching game in
   the app's Firestore project. That is exactly what Manage -> Results
   does by hand, so the leaderboard and Opta Stats pick it up on the
   next page load.

   It never invents games: a result is only written when the API's
   home + away pair matches a game already in fixtures.js, and only
   when the score differs from what is already stored (so re-running
   it costs nothing and manual corrections are left alone unless the
   API disagrees).

   RUN IT
     FOOTBALL_DATA_TOKEN=xxxxx node tools/update-results.mjs
     ...add --dry-run to print what would change without writing.

   ENV
     FOOTBALL_DATA_TOKEN  required — free key from football-data.org
     FIREBASE_PROJECT_ID  optional — defaults to projectId in config.js
     FD_COMPETITION       optional — default "PL"
     FD_SEASON            optional — e.g. "2026"; omit for current season
     FD_SAMPLE_FILE       optional — read a saved API response from disk
                                     instead of calling the API (testing)
   ===================================================================== */

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const DRY = process.argv.includes("--dry-run");

const COMPETITION = process.env.FD_COMPETITION || "PL";
const SEASON = process.env.FD_SEASON || "";
const SAMPLE = process.env.FD_SAMPLE_FILE || "";

/* ---------- the app's own fixture list, read straight from source ---- */
function loadFixtures() {
  const src = fs.readFileSync(path.join(ROOT, "fixtures.js"), "utf8");
  const ctx = vm.createContext({});
  vm.runInContext(src + "\n;globalThis.__FIXTURES__ = FIXTURES;", ctx, {
    filename: "fixtures.js",
  });
  return ctx.__FIXTURES__;
}

function projectId() {
  if (process.env.FIREBASE_PROJECT_ID) return process.env.FIREBASE_PROJECT_ID;
  const cfg = fs.readFileSync(path.join(ROOT, "config.js"), "utf8");
  const m = cfg.match(/projectId:\s*["']([^"']+)["']/);
  if (!m) throw new Error("Could not find projectId in config.js");
  return m[1];
}

/* ---------- team name matching --------------------------------------
   The API says "Brighton & Hove Albion FC", fixtures.js says "Brighton".
   Three passes, cheapest first: three-letter code, normalised name,
   then a containment fallback. Anything still unmatched is reported
   loudly rather than silently skipped. */
const TLA = {
  ARS: "Arsenal", AVL: "Aston Villa", BOU: "Bournemouth", BRE: "Brentford",
  BHA: "Brighton", CHE: "Chelsea", COV: "Coventry City", CRY: "Crystal Palace",
  EVE: "Everton", FUL: "Fulham", HUL: "Hull City", IPS: "Ipswich Town",
  LEE: "Leeds United", LIV: "Liverpool", MCI: "Manchester City",
  MUN: "Manchester United", NEW: "Newcastle United", NFO: "Nottingham Forest",
  TOT: "Tottenham Hotspur", SUN: "Sunderland", BUR: "Burnley",
  WOL: "Wolverhampton Wanderers", WHU: "West Ham United", SOU: "Southampton",
  LEI: "Leicester City", SHU: "Sheffield United", NOR: "Norwich City",
  WBA: "West Bromwich Albion", MID: "Middlesbrough", STK: "Stoke City",
};

function norm(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\b(fc|afc|cf|club|the)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function makeResolver(fixtures) {
  const teams = [...new Set(fixtures.flatMap((f) => [f.home_team, f.away_team]))];
  const byNorm = new Map(teams.map((t) => [norm(t), t]));
  return function resolve(apiTeam) {
    const tla = apiTeam && apiTeam.tla;
    if (tla && TLA[tla] && byNorm.has(norm(TLA[tla]))) return byNorm.get(norm(TLA[tla]));
    for (const cand of [apiTeam && apiTeam.name, apiTeam && apiTeam.shortName]) {
      const n = norm(cand);
      if (n && byNorm.has(n)) return byNorm.get(n);
    }
    const n = norm(apiTeam && apiTeam.name);
    if (n) {
      const hit = teams.find((t) => {
        const tn = norm(t);
        return tn.startsWith(n) || n.startsWith(tn);
      });
      if (hit) return hit;
    }
    return null;
  };
}

/* ---------- football-data.org ---------------------------------------- */
async function fetchFinished() {
  if (SAMPLE) return JSON.parse(fs.readFileSync(SAMPLE, "utf8")).matches || [];

  const token = process.env.FOOTBALL_DATA_TOKEN;
  if (!token) throw new Error("FOOTBALL_DATA_TOKEN is not set");

  const qs = new URLSearchParams({ status: "FINISHED" });
  if (SEASON) qs.set("season", SEASON);
  const url = `https://api.football-data.org/v4/competitions/${COMPETITION}/matches?${qs}`;

  const res = await fetch(url, { headers: { "X-Auth-Token": token } });
  if (res.status === 429) throw new Error("football-data.org rate limit hit (10 req/min on the free tier) — try again shortly");
  if (!res.ok) throw new Error(`football-data.org ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = await res.json();
  return json.matches || [];
}

/* ---------- Firestore REST (rules are open, so no auth needed) ------- */
const PID = projectId();
const BASE = `https://firestore.googleapis.com/v1/projects/${PID}/databases/(default)/documents`;

function numField(v) {
  if (!v || v.nullValue !== undefined) return null;
  if (v.integerValue != null) return Number(v.integerValue);
  if (v.doubleValue != null) return Number(v.doubleValue);
  return null;
}

async function fetchStored() {
  const out = new Map();
  let pageToken = "";
  do {
    const url = `${BASE}/matches?pageSize=300${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Firestore read ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const json = await res.json();
    for (const doc of json.documents || []) {
      const id = doc.name.split("/").pop();
      const f = doc.fields || {};
      out.set(id, {
        home: numField(f.home_score),
        away: numField(f.away_score),
        finished: !!(f.finished && f.finished.booleanValue),
      });
    }
    pageToken = json.nextPageToken || "";
  } while (pageToken);
  return out;
}

async function writeResult(id, home, away) {
  const mask = ["home_score", "away_score", "finished"]
    .map((f) => `updateMask.fieldPaths=${f}`)
    .join("&");
  const res = await fetch(`${BASE}/matches/${id}?${mask}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        home_score: { integerValue: String(home) },
        away_score: { integerValue: String(away) },
        finished: { booleanValue: true },
      },
    }),
  });
  if (!res.ok) throw new Error(`Firestore write ${id} -> ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

/* ---------- main ------------------------------------------------------ */
async function main() {
  const fixtures = loadFixtures();
  const resolve = makeResolver(fixtures);

  // home|away is unique across a league season, so it is the join key
  const byPair = new Map(
    fixtures.map((f) => [`${norm(f.home_team)}|${norm(f.away_team)}`, f])
  );

  const [apiMatches, stored] = await Promise.all([fetchFinished(), fetchStored()]);
  console.log(`project ${PID} · ${fixtures.length} fixtures · ${stored.size} match docs · ${apiMatches.length} finished games from the API`);

  const updates = [];
  const unmatched = [];
  const missingDocs = [];

  for (const m of apiMatches) {
    if (m.status !== "FINISHED") continue;
    const ft = (m.score && m.score.fullTime) || {};
    if (ft.home == null || ft.away == null) continue;

    const home = resolve(m.homeTeam);
    const away = resolve(m.awayTeam);
    if (!home || !away) {
      unmatched.push(`${(m.homeTeam || {}).name} v ${(m.awayTeam || {}).name}`);
      continue;
    }

    const fx = byPair.get(`${norm(home)}|${norm(away)}`);
    if (!fx) {
      unmatched.push(`${home} v ${away} (not in fixtures.js)`);
      continue;
    }

    const id = String(fx.id);
    const cur = stored.get(id);
    if (!cur) { missingDocs.push(`${id} ${home} v ${away}`); continue; }
    if (cur.finished && cur.home === ft.home && cur.away === ft.away) continue;

    updates.push({
      id,
      label: `wk${fx.week} ${home} ${ft.home}-${ft.away} ${away}`,
      home: ft.home,
      away: ft.away,
      was: cur.finished ? `was ${cur.home}-${cur.away}` : "new",
    });
  }

  if (unmatched.length) {
    console.warn(`\n!! ${unmatched.length} game(s) could not be matched to fixtures.js:`);
    for (const u of unmatched) console.warn(`   - ${u}`);
  }
  if (missingDocs.length) {
    console.warn(`\n!! ${missingDocs.length} game(s) have no Firestore doc yet (open the app once to seed):`);
    for (const u of missingDocs.slice(0, 10)) console.warn(`   - ${u}`);
  }

  if (!updates.length) {
    console.log("\nNothing to update — everything already matches.");
    return;
  }

  console.log(`\n${updates.length} result(s) to write${DRY ? " (dry run)" : ""}:`);
  for (const u of updates) console.log(`   #${u.id} ${u.label}  [${u.was}]`);
  if (DRY) return;

  for (const u of updates) await writeResult(u.id, u.home, u.away);
  console.log(`\nWrote ${updates.length} result(s).`);
}

main().catch((err) => {
  console.error(`\nFAILED: ${err.message}`);
  process.exit(1);
});
