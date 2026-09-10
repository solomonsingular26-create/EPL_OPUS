/* ===================================================================
   UEFA CHAMPIONS LEAGUE 2026/27 — LEAGUE PHASE
   Official draw. Matchdays 2 to 8 (126 games).

   Matchday 1 (8-10 Sep 2026) is deliberately NOT loaded — it was
   already played before this pool started. If you ever want it, add
   its games by hand from Manage -> UCL -> Games.

   Kickoffs are stored in UTC. European clocks go back on 25 Oct 2026,
   so October games are UTC+2 (16:45 / 19:00 UTC = 18:45 / 21:00 local)
   and November onwards are UTC+1 (17:45 / 20:00 UTC).

   IDs live in the 1001+ range so they can NEVER collide with the EPL
   fixtures, which use 1-380.
   =================================================================== */

const UCL_TEAMS = {
  "AEK Athens":        { name: "AEK Athens",          flag: "🟡" },
  "Arsenal":           { name: "Arsenal",             flag: "🔴" },
  "Aston Villa":       { name: "Aston Villa",         flag: "🦁" },
  "Atletico":          { name: "Atlético Madrid",     flag: "🐻" },
  "Barcelona":         { name: "Barcelona",           flag: "🔵" },
  "Bayern":            { name: "Bayern München",      flag: "🔴" },
  "Bodo/Glimt":        { name: "Bodø/Glimt",          flag: "🟡" },
  "Dortmund":          { name: "Borussia Dortmund",   flag: "🐝" },
  "Club Brugge":       { name: "Club Brugge",         flag: "🔷" },
  "Como":              { name: "Como 1907",           flag: "🔵" },
  "Fenerbahce":        { name: "Fenerbahçe",          flag: "🟡" },
  "Feyenoord":         { name: "Feyenoord",           flag: "⚪" },
  "Galatasaray":       { name: "Galatasaray",         flag: "🟠" },
  "Inter":             { name: "Inter Milan",         flag: "🐍" },
  "LASK":              { name: "LASK",                flag: "⚫" },
  "Leipzig":           { name: "RB Leipzig",          flag: "🐂" },
  "Lens":              { name: "RC Lens",             flag: "🟨" },
  "Lille":             { name: "Lille",               flag: "🔴" },
  "Liverpool":         { name: "Liverpool",           flag: "🔴" },
  "Man City":          { name: "Manchester City",     flag: "🔵" },
  "Man Utd":           { name: "Manchester United",   flag: "🔴" },
  "Napoli":            { name: "Napoli",              flag: "🔵" },
  "PSG":               { name: "Paris Saint-Germain", flag: "🗼" },
  "Porto":             { name: "Porto",               flag: "🐉" },
  "PSV":               { name: "PSV Eindhoven",       flag: "🔴" },
  "Real Betis":        { name: "Real Betis",          flag: "🟢" },
  "Real Madrid":       { name: "Real Madrid",         flag: "⚪" },
  "Roma":              { name: "Roma",                flag: "🐺" },
  "Sabah":             { name: "Sabah FC",            flag: "🟩" },
  "Shakhtar":          { name: "Shakhtar Donetsk",    flag: "🟧" },
  "Slavia Praha":      { name: "Slavia Praha",        flag: "🔴" },
  "Slovan Bratislava": { name: "Slovan Bratislava",   flag: "🔵" },
  "Sporting CP":       { name: "Sporting CP",         flag: "🟩" },
  "Stuttgart":         { name: "VfB Stuttgart",       flag: "⚪" },
  "Viking":            { name: "Viking FK",           flag: "🔵" },
  "Villarreal":        { name: "Villarreal",          flag: "🟡" },
};

/* Each matchday is a list of kickoff blocks; every game in a block
   shares that block's kickoff time. */
const UCL_MATCHDAYS = [
  { md: 2, blocks: [
    { ko: "2026-10-13T16:45:00Z", games: [
      ["Lens", "Sporting CP"], ["Sabah", "Slavia Praha"],
    ]},
    { ko: "2026-10-13T19:00:00Z", games: [
      ["Arsenal", "Lille"], ["Atletico", "Man Utd"], ["Inter", "Club Brugge"],
      ["Galatasaray", "Barcelona"], ["Leipzig", "PSV"], ["Viking", "Bayern"],
      ["Villarreal", "Napoli"],
    ]},
    { ko: "2026-10-14T16:45:00Z", games: [
      ["Feyenoord", "Como"], ["LASK", "Liverpool"],
    ]},
    { ko: "2026-10-14T19:00:00Z", games: [
      ["Roma", "Real Madrid"], ["Aston Villa", "Fenerbahce"], ["Shakhtar", "AEK Athens"],
      ["Bodo/Glimt", "Dortmund"], ["Man City", "PSG"], ["Real Betis", "Porto"],
      ["Slovan Bratislava", "Stuttgart"],
    ]},
  ]},
  { md: 3, blocks: [
    { ko: "2026-10-20T16:45:00Z", games: [
      ["Fenerbahce", "Slavia Praha"], ["Sabah", "Dortmund"],
    ]},
    { ko: "2026-10-20T19:00:00Z", games: [
      ["Roma", "Slovan Bratislava"], ["Porto", "PSV"], ["Liverpool", "Villarreal"],
      ["Man City", "AEK Athens"], ["PSG", "Barcelona"], ["Napoli", "Bodo/Glimt"],
      ["Stuttgart", "Atletico"],
    ]},
    { ko: "2026-10-21T16:45:00Z", games: [
      ["Como", "Man Utd"], ["Lille", "Galatasaray"],
    ]},
    { ko: "2026-10-21T19:00:00Z", games: [
      ["Aston Villa", "Viking"], ["Club Brugge", "Lens"], ["Bayern", "Arsenal"],
      ["Inter", "Shakhtar"], ["Real Madrid", "Leipzig"], ["Real Betis", "Feyenoord"],
      ["Sporting CP", "LASK"],
    ]},
  ]},
  { md: 4, blocks: [
    { ko: "2026-11-03T17:45:00Z", games: [
      ["Shakhtar", "Sporting CP"], ["Galatasaray", "Stuttgart"],
    ]},
    { ko: "2026-11-03T20:00:00Z", games: [
      ["Atletico", "Bayern"], ["Barcelona", "Aston Villa"], ["Feyenoord", "Inter"],
      ["Bodo/Glimt", "Lille"], ["LASK", "Slovan Bratislava"], ["Man Utd", "Roma"],
      ["Villarreal", "PSG"],
    ]},
    { ko: "2026-11-04T17:45:00Z", games: [
      ["AEK Athens", "Real Madrid"], ["Fenerbahce", "Liverpool"],
    ]},
    { ko: "2026-11-04T20:00:00Z", games: [
      ["Dortmund", "Real Betis"], ["Porto", "Napoli"], ["PSV", "Club Brugge"],
      ["Leipzig", "Man City"], ["Lens", "Como"], ["Slavia Praha", "Arsenal"],
      ["Viking", "Sabah"],
    ]},
  ]},
  { md: 5, blocks: [
    { ko: "2026-11-24T17:45:00Z", games: [
      ["Bodo/Glimt", "LASK"], ["Galatasaray", "Aston Villa"],
    ]},
    { ko: "2026-11-24T20:00:00Z", games: [
      ["Arsenal", "Dortmund"], ["Como", "AEK Athens"], ["Feyenoord", "Porto"],
      ["Man City", "Napoli"], ["Leipzig", "Lens"], ["Real Madrid", "PSV"],
      ["Slovan Bratislava", "Real Betis"],
    ]},
    { ko: "2026-11-25T17:45:00Z", games: [
      ["Sabah", "Barcelona"], ["Slavia Praha", "Villarreal"],
    ]},
    { ko: "2026-11-25T20:00:00Z", games: [
      ["Atletico", "Viking"], ["Club Brugge", "Liverpool"], ["Inter", "Stuttgart"],
      ["Shakhtar", "Fenerbahce"], ["Lille", "Bayern"], ["PSG", "Roma"],
      ["Sporting CP", "Man Utd"],
    ]},
  ]},
  { md: 6, blocks: [
    { ko: "2026-12-08T17:45:00Z", games: [
      ["Viking", "Feyenoord"], ["Villarreal", "Sabah"],
    ]},
    { ko: "2026-12-08T20:00:00Z", games: [
      ["AEK Athens", "Galatasaray"], ["Roma", "Sporting CP"], ["Aston Villa", "PSG"],
      ["Barcelona", "Man City"], ["Bayern", "Slavia Praha"], ["Man Utd", "Leipzig"],
      ["Napoli", "Club Brugge"],
    ]},
    { ko: "2026-12-09T17:45:00Z", games: [
      ["Real Betis", "Como"], ["Slovan Bratislava", "Shakhtar"],
    ]},
    { ko: "2026-12-09T20:00:00Z", games: [
      ["Arsenal", "Real Madrid"], ["Dortmund", "Inter"], ["LASK", "Fenerbahce"],
      ["Liverpool", "Porto"], ["PSV", "Atletico"], ["Lens", "Bodo/Glimt"],
      ["Stuttgart", "Lille"],
    ]},
  ]},
  { md: 7, blocks: [
    { ko: "2027-01-19T17:45:00Z", games: [
      ["Bodo/Glimt", "Atletico"], ["Galatasaray", "Feyenoord"],
    ]},
    { ko: "2027-01-19T20:00:00Z", games: [
      ["AEK Athens", "Roma"], ["Aston Villa", "Dortmund"], ["Inter", "Liverpool"],
      ["Porto", "Slavia Praha"], ["Lille", "Slovan Bratislava"], ["Real Madrid", "LASK"],
      ["Stuttgart", "Club Brugge"],
    ]},
    { ko: "2027-01-20T17:45:00Z", games: [
      ["Fenerbahce", "Villarreal"], ["Sabah", "Napoli"],
    ]},
    { ko: "2027-01-20T20:00:00Z", games: [
      ["Como", "PSG"], ["Man Utd", "Bayern"], ["Leipzig", "Shakhtar"],
      ["Lens", "Man City"], ["Real Betis", "Arsenal"], ["Sporting CP", "Barcelona"],
      ["Viking", "PSV"],
    ]},
  ]},
  { md: 8, blocks: [
    /* every MD8 game kicks off at the same moment */
    { ko: "2027-01-27T20:00:00Z", games: [
      ["Arsenal", "Sabah"], ["Roma", "Lille"], ["Atletico", "Fenerbahce"],
      ["Dortmund", "AEK Athens"], ["Club Brugge", "Bodo/Glimt"], ["Bayern", "Real Betis"],
      ["Barcelona", "Como"], ["Shakhtar", "Real Madrid"], ["Feyenoord", "Leipzig"],
      ["LASK", "Porto"], ["Liverpool", "Lens"], ["Man City", "Sporting CP"],
      ["PSG", "Galatasaray"], ["PSV", "Stuttgart"], ["Slavia Praha", "Aston Villa"],
      ["Napoli", "Viking"], ["Villarreal", "Man Utd"], ["Slovan Bratislava", "Inter"],
    ]},
  ]},
];

/* expand into the flat list the app seeds from.
   id / ordering start at 1001 so EPL (1-380) is never touched. */
const UCL_ID_BASE = 1000;
const UCL_FIXTURES = [];
{
  let n = 0;
  for (const md of UCL_MATCHDAYS) {
    for (const b of md.blocks) {
      for (const [h, a] of b.games) {
        const H = UCL_TEAMS[h] || { name: h, flag: "⚽" };
        const A = UCL_TEAMS[a] || { name: a, flag: "⚽" };
        n++;
        UCL_FIXTURES.push({
          id: UCL_ID_BASE + n, comp: "UCL", week: md.md,
          ordering: UCL_ID_BASE + n, slot_label: null,
          home_team: H.name, away_team: A.name,
          home_flag: H.flag, away_flag: A.flag,
          kickoff: b.ko,
        });
      }
    }
  }
}
