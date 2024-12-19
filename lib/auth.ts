import db from '@/db/db';
import { BetterSqlite3Adapter } from '@lucia-auth/adapter-sqlite';
import { Lucia, Session, User } from 'lucia';
import { cookies } from 'next/headers';
import { cache } from 'react';

// 初始化 Lucia
const adapter = new BetterSqlite3Adapter(db, {
    user: 'users',
    session: 'sessions'
});

const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
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
    id: number;
    email?: string;
    password?: string;
    name: string;
    nickname?: string;
    google_id?: string;
    github_id?: string;
    provider: 'google' | 'github' | 'local';
}

// Session 驗證結果型別
interface AuthResult {
    user: User | null;
    session: Session | null;
}

// 使用 React cache 来缓存验证结果
export const getAuth = cache(async () => {
    const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) return { user: null, session: null };

    const { session, user } = await lucia.validateSession(sessionId);
    try {
        if (session?.fresh) {
            const sessionCookie = lucia.createSessionCookie(session.id);
            (await cookies()).set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            );
        }
        if (!session) {
            const sessionCookie = lucia.createBlankSessionCookie();
            (await cookies()).set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            );
        }
        return { user, session };
    } catch {
        return { user: null, session: null };
    }
});

// 创建会话
export const createAuthSession = async (userId: string): Promise<void> => {
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    );
};

// 注销会话
export const destroySession = async (): Promise<{ error?: string }> => {
    const { session } = await getAuth();
    if (!session) {
        return { error: 'Unauthorized!' };
    }

    try {
        await lucia.invalidateSession(session.id);
        const sessionCookie = lucia.createBlankSessionCookie();
        (await cookies()).set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );
        return {};
    } catch (error) {
        console.error('Error destroying session:', error);
        return { error: 'Failed to destroy session!' };
    }
};

// 为了向后兼容，保留 verifyAuth
export const verifyAuth = getAuth;
