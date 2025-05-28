const fs = require('fs');
const { Pool } = require('pg');
const path = require('path');
const { parse } = require('csv-parse/sync');

const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'beer_tracker',
  password: 'postgres',
  port: 5432,
});

async function importBeers() {
  try {
    // Read the beers.sql file
    const sqlFile = path.join(__dirname, 'beers.sql');
    const content = fs.readFileSync(sqlFile, 'utf8');

    // Extract all value tuples from INSERT statements
    const insertRegex = /INSERT INTO `beers` VALUES\s*(.*);/gms;
    let match;
    let total = 0, success = 0, fail = 0;
    while ((match = insertRegex.exec(content)) !== null) {
      // The value tuples can be separated by '),(' but may contain quoted commas
      let tuplesStr = match[1].trim();
      if (tuplesStr.endsWith(';')) tuplesStr = tuplesStr.slice(0, -1);
      // Remove leading and trailing parentheses if present
      if (tuplesStr.startsWith('(') && tuplesStr.endsWith(')')) {
        tuplesStr = tuplesStr.slice(1, -1);
      }
      // Split tuples by '),(' (not inside quotes)
      const tuples = tuplesStr.split(/\),\(/g);
      for (const tuple of tuples) {
        total++;
        // Use csv-parse to robustly parse the tuple
        try {
          const records = parse(tuple, {
            delimiter: ',',
            quote: "'",
            escape: '\\',
            relaxQuotes: true,
            relaxColumnCount: true,
          });
          const values = records[0];
          // Remove surrounding quotes from string values
          const cleanValues = values.map(v =>
            v === null || v === undefined ? null :
            (typeof v === 'string' && v.toLowerCase() === 'null') ? null : v
          );
          // Insert into DB (skip id, which is auto-incremented)
          const columns = [
            'brewery_id', 'name', 'cat_id', 'style_id', 'abv', 'ibu',
            'srm', 'upc', 'filepath', 'descript', 'add_user', 'last_mod'
          ];
          const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
          const query = `INSERT INTO beers (${columns.join(', ')}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`;
          await pool.query(query, cleanValues.slice(1)); // skip id
          success++;
        } catch (error) {
          fail++;
          console.error('Error importing beer record:', error.message);
        }
      }
    }
    console.log(`Import completed. Success: ${success}, Failed: ${fail}, Total: ${total}`);
  } catch (error) {
    console.error('Error during import:', error);
  } finally {
    await pool.end();
  }
}

importBeers(); 