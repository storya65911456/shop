import sql, { Database } from 'better-sqlite3';

// 定義資料表的型別（可選）
interface User {
    id: number;
    email: string;
    password: string;
}

interface Session {
    id: string;
    expires_at: number;
    user_id: number;
}

// 建立資料庫連線
const db: Database = sql('shop.db');

// 初始化資料表
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT NOT NULL PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// 匯出資料庫
export default db;
