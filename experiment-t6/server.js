// Three versions of the "most viewed this hour" dashboard query.
const http = require('http');
const Database = require('better-sqlite3');
const plain = new Database('views.db', { readonly: true });           // no index
const indexed = new Database('views_indexed.db', { readonly: true }); // index on (viewed_at, item_id)

const SQL = `SELECT item_id, COUNT(*) AS views FROM views
             WHERE viewed_at >= ? GROUP BY item_id ORDER BY views DESC LIMIT 1`;
const qPlain = plain.prepare(SQL), qIndexed = indexed.prepare(SQL);
const hourAgo = () => Math.floor(Date.now() / 1000) - 3600;

let cache = null, cachedAt = 0;              // result kept in memory
const CACHE_MS = 60 * 60 * 1000;             // recomputed at most once per hour

http.createServer((req, res) => {
  let result;
  if (req.url === '/naive') result = qPlain.get(hourAgo());          // full table scan on every request
  else if (req.url === '/indexed') result = qIndexed.get(hourAgo()); // index limits the scan to the last hour
  else if (req.url === '/cached') {
    if (!cache || Date.now() - cachedAt > CACHE_MS) { cache = qIndexed.get(hourAgo()); cachedAt = Date.now(); }
    result = cache;                                                   // no database call for most requests
  } else { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(result));
}).listen(3000, () => console.log('listening on 3000'));
