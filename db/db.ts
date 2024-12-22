import sql, { Database } from 'better-sqlite3';

// 定義資料表的型別（可選）

export interface Session {
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
    password TEXT,
    name TEXT NOT NULL,
    nickname TEXT,
    google_id TEXT UNIQUE,
    github_id TEXT UNIQUE,
    provider TEXT CHECK(provider IN ('google', 'github', 'local')) DEFAULT 'local'
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

// 初始化商品表
db.exec(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        seller_id INTEGER,
        seller_type TEXT CHECK(seller_type IN ('company', 'user')) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES users(id)
    )
`);

const hasProducts = db.prepare('SELECT COUNT(*) as count FROM products').get() as {
    count: number;
};

if (hasProducts.count === 0) {
    db.exec(`
        INSERT INTO products (name, description, price, stock, seller_type)
        VALUES 
            ('精選咖啡豆', '來自哥倫比亞的優質阿拉比卡咖啡豆，中度烘焙', 399.0, 100, 'company'),
            ('手沖咖啡套組', '含手沖壺、濾杯、濾紙等完整配件', 1299.0, 100, 'company'),
            ('職人手作餅乾', '純手工製作，無添加防腐劑', 199.0, 200, 'company'),
            ('自動鉛筆', '優質好寫，便宜', 20.0, 350, 'company');
    `);
}

// 匯出資料庫
export default db;
