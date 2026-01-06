import { Pool } from 'pg';

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5434'),
  database: process.env.DB_NAME || 'invoices_db',
  user: process.env.DB_USER || 'invoices_user',
  password: process.env.DB_PASSWORD || 'adminAa1999aA;L*',
});
