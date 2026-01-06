import { pool } from '../src/config/database';
import fs from 'fs';
import path from 'path';

async function migrate() {
  try {
    console.log('Running database migration...');
    
    const sql = fs.readFileSync(path.join(__dirname, '../scripts/init.sql'), 'utf8');
    await pool.query(sql);
    
    console.log('Migration completed successfully!');
    await pool.end();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
