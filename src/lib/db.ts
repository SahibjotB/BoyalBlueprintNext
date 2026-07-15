import { Pool } from "pg"

const globalForPg = globalThis as unknown as { pool: Pool }

export const pool =
  globalForPg.pool ||
  new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432", 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }, // REQUIRED for Azure
  })

if (process.env.NODE_ENV !== "production") globalForPg.pool = pool

export default pool