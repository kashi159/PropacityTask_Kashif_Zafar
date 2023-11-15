// util/database.js
const { Pool } = require('pg');

const database = process.env.DB_NAME;
const password = process.env.DB_PASS;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: database,
  password: password,
  port: 5432,
});

const initializeTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS folders (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        user_id INTEGER REFERENCES users(id),
        parent_id INTEGER REFERENCES folders(id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS uploads (
        id SERIAL PRIMARY KEY,
        file_name VARCHAR(255) NOT NULL,
        size INTEGER NOT NULL,
        url VARCHAR(255) NOT NULL,
        user_id INTEGER REFERENCES users(id),
        folder_id INTEGER REFERENCES folders(id)
      );
    `);

    console.log('Tables initialized successfully');
  } catch (error) {
    console.error('Error initializing tables:', error);
  }
};

module.exports = {
  pool, 
  initializeTables,
};
