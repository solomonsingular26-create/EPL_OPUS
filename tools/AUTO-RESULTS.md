# Automatic results

`tools/update-results.mjs` fills in the scores that Manage → Results asks you
to type. It reads the finished Premier League games from football-data.org,
finds the matching game in `fixtures.js`, and writes `home_score`,
`away_score` and `finished` onto that match in Firestore — the same three
fields the Manage screen writes.

## One-time setup

1. **Get a free API key** — sign up at <https://www.football-data.org/client/register>.
   The free tier covers the Premier League and allows 10 requests a minute;
   this script uses one request per run.
2. **Put the app in a GitHub repo** (if it isn't already) with `index.html`
   at the root, so `tools/` and `.github/` sit beside it.
3. **Add the key as a secret** — repo → Settings → Secrets and variables →
   Actions → New repository secret → name `FOOTBALL_DATA_TOKEN`, value the key.
4. **Check it works** — repo → Actions → "Update EPL results" → Run workflow.
   The log lists every result it wrote.

After that it runs itself, hourly. Change the `cron:` line in
`.github/workflows/update-results.yml` if you want it more or less often.

## Running it yourself

```sh
FOOTBALL_DATA_TOKEN=your-key node tools/update-results.mjs --dry-run   # show
FOOTBALL_DATA_TOKEN=your-key node tools/update-results.mjs             # write
```

## What it will and won't touch

- It only writes a game whose home + away teams already exist in
  `fixtures.js`, matched by team, not by date — so rearranged fixtures and
  changed kickoff times are fine.
- It skips games whose stored score already matches, so re-running is free.
- It **will** correct a score you typed in by hand if the API disagrees.
- It ignores postponed, abandoned and in-play games; only `FINISHED` counts.
- Any game it can't match is printed as a warning, never guessed.
- Points, deadlines, predictions and player admin are untouched.

The app loads its data once per page load, so a new result shows up on the
next refresh.

## If the fixture list changes

The script reads `fixtures.js` directly, so editing that file is enough —
there is no second copy of the fixture list to keep in sync. Teams are
matched on their three-letter code first (`TLA` in the script) and their
name second; if a promoted club ever fails to match, the warning tells you
which name to add.
