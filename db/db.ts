import sql, { Database } from 'better-sqlite3';

// 定義資料表的型別（可選）

export interface Session {
    id: string;
    expires_at: number;
    user_id: number;
}

// 建立資料庫連線
export const db: Database = sql('shop.db');

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

// 商品表，新增平均評分欄位
db.exec(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        discount_percent INTEGER CHECK(discount_percent >= 0 AND discount_percent <= 100) DEFAULT 100,
        seller_id INTEGER NOT NULL,
        has_variants BOOLEAN DEFAULT FALSE,
        rating_avg DECIMAL(2,1) DEFAULT 0,  -- 平均評分，保留一位小數
        rating_count INTEGER DEFAULT 0,     -- 評價數量
        sales_count INTEGER DEFAULT 0,      -- 新增銷售數量欄位
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES users(id)
    )
`);

// 新增商品變體表（用於管理不同尺寸和顏色的組合）
db.exec(`
    CREATE TABLE IF NOT EXISTS product_variants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        size TEXT,
        color TEXT,
        stock INTEGER NOT NULL DEFAULT 0,
        sku TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE(product_id, size, color)
    )
`);

// 新增商品評價表
db.exec(`
    CREATE TABLE IF NOT EXISTS product_reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        rating INTEGER CHECK(rating >= 1 AND rating <= 5) NOT NULL,
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(product_id, user_id)  -- 每個用戶只能評價一次
    )
`);

// 新增觸發器，在新增評價時自動更新商品的平均評分和評價數量
db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_product_rating_after_insert
    AFTER INSERT ON product_reviews
    BEGIN
        UPDATE products 
        SET 
            rating_avg = (
                SELECT ROUND(AVG(CAST(rating AS FLOAT)), 1)
                FROM product_reviews
                WHERE product_id = NEW.product_id
            ),
            rating_count = (
                SELECT COUNT(*)
                FROM product_reviews
                WHERE product_id = NEW.product_id
            )
        WHERE id = NEW.product_id;
    END;
`);

// 新增觸發器，在更新評價時自動更新商品的平均評分
db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_product_rating_after_update
    AFTER UPDATE ON product_reviews
    BEGIN
        UPDATE products 
        SET 
            rating_avg = (
                SELECT ROUND(AVG(CAST(rating AS FLOAT)), 1)
                FROM product_reviews
                WHERE product_id = NEW.product_id
            )
        WHERE id = NEW.product_id;
    END;
`);

// 新增觸發器，在刪除評價時自動更新商品的平均評分和評價數量
db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_product_rating_after_delete
    AFTER DELETE ON product_reviews
    BEGIN
        UPDATE products 
        SET 
            rating_avg = COALESCE(
                (
                    SELECT ROUND(AVG(CAST(rating AS FLOAT)), 1)
                    FROM product_reviews
                    WHERE product_id = OLD.product_id
                ),
                0
            ),
            rating_count = (
                SELECT COUNT(*)
                FROM product_reviews
                WHERE product_id = OLD.product_id
            )
        WHERE id = OLD.product_id;
    END;
`);

// 修改商品分類表的定義
db.exec(`
    CREATE TABLE IF NOT EXISTS product_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        parent_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES product_categories(id)
    )
`);

// 新增商品與分類的關聯表
db.exec(`
    CREATE TABLE IF NOT EXISTS product_category_relations (
        product_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        PRIMARY KEY (product_id, category_id),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE CASCADE
    )
`);

const hasProducts = db.prepare('SELECT COUNT(*) as count FROM products').get() as {
    count: number;
};

if (hasProducts.count === 0) {
    // 創建系統帳號
    db.exec(`
        INSERT INTO users (email, name, provider)
        VALUES 
            ('system@shop.com', '系統管理員', 'local'),
            ('system2@shop.com', '系統評價員', 'local');
    `);

    // 獲取系統賣家ID
    const systemUser = db
        .prepare('SELECT id FROM users WHERE email = ?')
        .get('system@shop.com') as { id: number };

    const systemReviewer = db
        .prepare('SELECT id FROM users WHERE email = ?')
        .get('system2@shop.com') as { id: number };

    // 插入基本商品，使用系統賣家ID
    db.exec(`
        INSERT INTO products (
            name, 
            description, 
            price, 
            discount_percent,
            seller_id, 
            has_variants,
            sales_count
        )
        VALUES 
            (
                '精選咖啡豆', 
                '來自哥倫比亞的優質阿拉比卡咖啡豆，中度烘焙', 
                399.0,
                80,
                ${systemUser.id}, 
                false,
                156
            ),
            (
                '手沖咖啡套組', 
                '含手沖壺、濾杯、濾紙等完整配件', 
                1299.0,
                100,
                ${systemUser.id}, 
                false,
                89
            ),
            (
                '職人手作餅乾', 
                '純手工製作，無添加防腐劑', 
                199.0,
                85,
                ${systemUser.id}, 
                false,
                324
            ),
            (
                '自動鉛筆', 
                '優質好寫，便宜', 
                20.0,
                100,
                ${systemUser.id}, 
                false,
                1240
            ),
            (
                '純棉T恤', 
                '100%純棉，舒適透氣', 
                599.0,
                90,
                ${systemUser.id}, 
                true,
                438
            );
    `);

    // 為一般商品添加默認庫存記錄
    db.exec(`
        INSERT INTO product_variants (product_id, stock, sku)
        VALUES 
            (1, 100, 'COFFEE-001'),
            (2, 50, 'COFFEE-SET-001'),
            (3, 200, 'COOKIE-001'),
            (4, 350, 'PENCIL-001');
    `);

    // 為純棉T恤添加不同尺寸和顏色的庫存
    db.exec(`
        INSERT INTO product_variants (product_id, size, color, stock, sku)
        VALUES 
            (5, 'S', '白色', 50, 'TCT-S-WHITE'),
            (5, 'S', '黑色', 50, 'TCT-S-BLACK'),
            (5, 'M', '白色', 100, 'TCT-M-WHITE'),
            (5, 'M', '黑色', 100, 'TCT-M-BLACK'),
            (5, 'L', '白色', 80, 'TCT-L-WHITE'),
            (5, 'L', '黑色', 80, 'TCT-L-BLACK');
    `);

    // 為商品添加示例評價
    db.exec(`
        INSERT INTO product_reviews (product_id, user_id, rating, comment)
        VALUES 
            (1, ${systemUser.id}, 5, '咖啡豆香氣十足，很推薦！'),
            (1, ${systemReviewer.id}, 4, '品質不錯，但價格稍高'),
            (2, ${systemUser.id}, 5, '套組很完整，很適合入門'),
            (3, ${systemReviewer.id}, 4, '餅乾很好吃，包裝也很精美'),
            (5, ${systemUser.id}, 5, '衣服質地很好，尺寸也很合身');
    `);

    // 先插入主分類
    db.exec(`
        INSERT INTO product_categories (name, description)
        VALUES 
            ('飲品', '咖啡、茶等飲品相關商品'),
            ('廚房', '廚房相關的工具和用品'),
            ('食品', '餅乾、零食等食品'),
            ('文具', '筆、本子等文具用品'),
            ('服飾', '衣服、配件等服飾商品');
    `);

    // 再插入子分類，使用 parent_id 關聯到主分類
    db.exec(`
        INSERT INTO product_categories (name, description, parent_id)
        VALUES 
            ('咖啡', '咖啡相關商品', 1),
            ('茶飲', '茶類飲品', 1),
            ('咖啡器具', '咖啡沖煮器具', 2),
            ('餅乾', '各式餅乾點心', 3),
            ('零食', '休閒零食', 3),
            ('書寫工具', '筆類文具', 4),
            ('上衣', 'T恤、襯衫等', 5),
            ('褲子', '各式褲裝', 5);
    `);

    // 修改商品分類關聯
    db.exec(`
        INSERT INTO product_category_relations (product_id, category_id)
        VALUES 
            (1, 6),  -- 精選咖啡豆 -> 咖啡
            (2, 8),  -- 手沖咖啡套組 -> 咖啡器具
            (3, 9),  -- 職人手作餅乾 -> 餅乾
            (4, 11), -- 自動鉛筆 -> 書寫工具
            (5, 12); -- 純棉T恤 -> 上衣
    `);
}

// 匯出資料庫
export default db;
