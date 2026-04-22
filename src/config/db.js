const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'kuliah',
  password: '12345678',
  port: 5433,
});

module.exports = pool;