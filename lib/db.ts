// lib/db.ts
import mysql from "mysql2/promise";

// Global cache to prevent duplicate pools during Next.js hot-reloads
const globalForPool = global as unknown as { pool: mysql.Pool };

export const db =
  globalForPool.pool ||
  mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "service_finder", // Verified database target catalog
    waitForConnections: true,
    connectionLimit: 10,        // Max active open sockets allowed simultaneously
    queueLimit: 0,
  });

if (process.env.NODE_ENV !== "production") globalForPool.pool = db;