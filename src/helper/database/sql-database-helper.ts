import { logger } from '../logger/logger';
import sql from 'mssql';
import * as dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
export enum databaseName {
  shieldfaculty = 'shieldfaculty',
  shieldstudent = 'shieldstudent',
}

const env = (process.env.ENV || 'qa').toLowerCase();
const envPath = path.resolve(process.cwd(), `env/.env.${env}`);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  // This will now tell you exactly where it's looking if it fails
  throw new Error(`❌ Environment file not found at: ${envPath}`);
}
export async function queryDb(db: string, script: string, timeout = 30000) {
  const config: sql.config = {
    server: process.env.DB_SERVER || 'localhost',
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: `${db}-${env}`,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      connectTimeout: 15000,
      requestTimeout: timeout,
    },
    pool: { max: 1, min: 0, idleTimeoutMillis: 30000 },
  };

  logger.info(`🌐 DB Query | Env: ${env.toUpperCase()} | DB: ${config.database}`);

  try {
    const pool = await new sql.ConnectionPool(config).connect();
    const result = await pool.request().query(script);

    // Auto-trimming logic
    const processedData = result.recordset.map(row => {
      Object.keys(row).forEach(key => {
        if (typeof row[key] === 'string') row[key] = row[key].trim();
      });
      return row;
    });

    await pool.close();
    return processedData;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logger.error(`❌ SQL Error on ${env.toUpperCase()}: ${errorMessage}`);
    throw err;
  }
}
