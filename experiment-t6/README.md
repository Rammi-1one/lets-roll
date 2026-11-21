# Task 6 mini experiment: "most viewed this hour" under load

Setup (21 Nov 2026): Node.js + better-sqlite3, k6 v0.54.0, 2-core cloud container, load generator on the same machine.

1. `node seed.js` creates views.db (2,000,000 views of 500 items over 30 days, skewed popularity).
2. Copy to views_indexed.db and run `CREATE INDEX idx_views_time_item ON views(viewed_at, item_id);`
3. `node server.js` serves /naive, /indexed, /cached on port 3000.
4. `k6 run -e ENDPOINT=naive --summary-export=sum_naive.json load.js` (repeat for indexed, cached).

| Version | Avg | Median | p95 | Max | req/s | Requests |
|---|---|---|---|---|---|---|
| naive | 2065.5 ms | 1466.0 ms | 3174.3 ms | 33,746 ms | 21 | 878 |
| indexed | 20.1 ms | 21.4 ms | 29.5 ms | 74 ms | 2,171 | 86,871 |
| cached | 1.8 ms | 1.5 ms | 4.5 ms | 36 ms | 23,982 | 959,297 |

0% failed requests in all runs. Raw k6 output in run_*.txt.

The database files (views.db, views_indexed.db, about 90 MB) are not included; `seed.js` recreates them. Install with `npm install better-sqlite3`.
