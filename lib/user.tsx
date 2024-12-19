import db from '@/db/db';

// 定義資料庫返回的原始資料結構
interface UserRow {
    id: number;
    email: string;
    password: string;
}

// 定義用戶介面

export interface UserData {
    id: string;
    email?: string;
    password?: string;
    name: string;
    nickname?: string;
    provider: 'google' | 'github' | 'local';
    google_id?: string;
    github_id?: string;
}

export const getUserById = (userId: string): UserData | undefined => {
    return db
        .prepare(
            `
            SELECT id, email, name, provider, google_id, github_id
            FROM users
            WHERE id = ?
        `
        )
        .get(userId) as UserData | undefined;
};

export const getUserByEmail = (email: string): UserData | undefined => {
    return db
        .prepare(
            `
            SELECT id, email, name, provider, google_id, github_id
            FROM users
            WHERE email = ?
        `
        )
        .get(email) as UserData | undefined;
};

// 更新用戶資料
export const updateUser = (userId: string, data: Partial<Omit<UserData, 'id'>>) => {
    const updates = Object.entries(data)
        .filter(([_, value]) => value !== undefined)
        .map(([key, _]) => `${key} = @${key}`)
        .join(', ');

    if (!updates) return;

    return db
        .prepare(
            `
            UPDATE users
            SET ${updates}
            WHERE id = @id
        `
        )
        .run({
            id: userId,
            ...data
        });
};
// 新增用戶相關的輔助函數
export const findUserByEmail = async (email: string) => {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as
        | UserData
        | undefined;
};

export const findUserByGoogleId = async (googleId: string) => {
    return db.prepare('SELECT * FROM users WHERE google_id = ?').get(googleId) as
        | UserData
        | undefined;
};

export const findUserByGithubId = async (githubId: string) => {
    return db.prepare('SELECT * FROM users WHERE github_id = ?').get(githubId) as
        | UserData
        | undefined;
};

export const createUser = async (userData: {
    email?: string;
    name: string;
    provider: 'google' | 'github' | 'local';
    google_id?: string;
    github_id?: string;
    password?: string;
}) => {
    const stmt = db.prepare(`
        INSERT INTO users (email, name, provider, google_id, github_id, password)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
        userData.email,
        userData.name,
        userData.provider,
        userData.google_id,
        userData.github_id,
        userData.password
    );

    return result.lastInsertRowid.toString();
};

// export const createUser = (email: string, password: string): string => {
//     const result = db
//         .prepare('INSERT INTO users (email, password) VALUES (?, ?)')
//         .run(email, password);
//     return result.lastInsertRowid.toString();
// };

// export const getUserByEmail = (email: string): User | null => {
//     const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined;
//     if (!user) return null;

//     // 將資料庫的數字 ID 轉換為字串
//     return {
//         id: user.id.toString(),
//         email: user.email,
//         password: user.password
//     };
// };
