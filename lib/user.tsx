import db from '@/db/db';

// 定義資料庫返回的原始資料結構
interface UserRow {
    id: number;
    email: string;
    password: string;
}

// 定義用戶介面
export interface User {
    id: string;
    email: string;
    password: string;
}

export const createUser = (email: string, password: string): string => {
    const result = db
        .prepare('INSERT INTO users (email, password) VALUES (?, ?)')
        .run(email, password);
    return result.lastInsertRowid.toString();
};

export const getUserByEmail = (email: string): User | null => {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined;
    if (!user) return null;
    
    // 將資料庫的數字 ID 轉換為字串
    return {
        id: user.id.toString(),
        email: user.email,
        password: user.password
    };
};
