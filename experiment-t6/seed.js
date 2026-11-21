// Creates a views table like Let's Roll would have: one row per page view.
// 2,000,000 views of 500 listings spread over the last 30 days.
const Database = require('better-sqlite3');
const db = new Database('views.db');
db.exec(`DROP TABLE IF EXISTS views; CREATE TABLE views (id INTEGER PRIMARY KEY, item_id INTEGER NOT NULL, viewed_at INTEGER NOT NULL);`);
const now = Math.floor(Date.now() / 1000);
const insert = db.prepare('INSERT INTO views (item_id, viewed_at) VALUES (?, ?)');
const N = 2000000, ITEMS = 500, SPAN = 30 * 24 * 3600;
const tx = db.transaction(() => {
  for (let i = 0; i < N; i++) {
    // some items are much more popular than others (skewed like real traffic)
    const item = Math.floor(Math.pow(Math.random(), 2.5) * ITEMS) + 1;
    insert.run(item, now - Math.floor(Math.random() * SPAN));
  }
});
tx();
console.log('rows', db.prepare('SELECT COUNT(*) c FROM views').get().c);
