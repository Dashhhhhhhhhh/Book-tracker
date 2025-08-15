const { Pool } = require('pg');

const pool = new Pool({
  user: 'kevin_user',
  host: 'localhost',
  database: 'book_tracker',
  password: 'rf@nna23dsZ123', // change to your actual password
  port: 5432,
});

module.exports = pool;