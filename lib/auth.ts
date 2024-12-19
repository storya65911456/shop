'use server';

import db from '@/db/db';
import { BetterSqlite3Adapter } from '@lucia-auth/adapter-sqlite';
import { Lucia, Session, User } from 'lucia';
import { cookies } from 'next/headers';

// 初始化 Lucia
const adapter = new BetterSqlite3Adapter(db, {
    user: 'users', // 使用者資料表
    session: 'sessions' // Session 資料表
});

const lucia = new Lucia(adapter, {
    sessionCookie: {
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === 'production'
        }
    },
    getUserAttributes: (attributes) => {
        return { ...attributes };
    }
});

declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseUserAttributes {
    email?: string;
    password?: string;
    name: string;
    google_id?: string;
    github_id?: string;
    provider?: string;
}

// Session 驗證結果型別
interface AuthResult {
    user: User | null;
    session: Session | null;
}

// 設置 Cookie 輔助函數
const setCookie = async (
    name: string,
    value: string,
    attributes: Record<string, any>
) => {
    (await cookies()).set(name, value, attributes);
};

// 創建 Session
export const createAuthSession = async (userId: string): Promise<void> => {
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    await setCookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
};

// 驗證 Session
export const verifyAuth = async (): Promise<AuthResult> => {
    const sessionCookie = (await cookies()).get(lucia.sessionCookieName);
    if (!sessionCookie) return { user: null, session: null };

    const sessionId = sessionCookie.value;
    if (!sessionId) return { user: null, session: null };

    try {
        const result = await lucia.validateSession(sessionId);

        if (result.session && result.session.fresh) {
            const newSessionCookie = lucia.createSessionCookie(result.session.id);
            await setCookie(
                newSessionCookie.name,
                newSessionCookie.value,
                newSessionCookie.attributes
            );
        } else if (!result.session) {
            const blankSessionCookie = lucia.createBlankSessionCookie();
            await setCookie(
                blankSessionCookie.name,
                blankSessionCookie.value,
                blankSessionCookie.attributes
            );
        }

        return result;
    } catch (error) {
        console.error('Session validation error:', error);
        return { user: null, session: null };
    }
};

// 清除 Session
export const destroySession = async (): Promise<{ error?: string }> => {
    const { session } = await verifyAuth();
    if (!session) {
        return { error: 'Unauthorized!' };
    }

    try {
        await lucia.invalidateSession(session.id);
        const blankSessionCookie = lucia.createBlankSessionCookie();
        await setCookie(
            blankSessionCookie.name,
            blankSessionCookie.value,
            blankSessionCookie.attributes
        );
        return {};
    } catch (error) {
        console.error('Error destroying session:', error);
        return { error: 'Failed to destroy session!' };
    }
};

// 新增用戶相關的輔助函數
export const findUserByEmail = async (email: string) => {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as
        | User
        | undefined;
};

export const findUserByGoogleId = async (googleId: string) => {
    return db.prepare('SELECT * FROM users WHERE google_id = ?').get(googleId) as
        | User
        | undefined;
};

export const findUserByGithubId = async (githubId: string) => {
    return db.prepare('SELECT * FROM users WHERE github_id = ?').get(githubId) as
        | User
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
