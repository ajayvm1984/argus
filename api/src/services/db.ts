import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../models/schema.js';

const pool = new Pool({
  host: process.env.DB_HOST || 'argus-db',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'argus',
  user: process.env.DB_USER || 'argus',
  password: process.env.DB_PASSWORD
});

export const db = drizzle(pool, { schema });
