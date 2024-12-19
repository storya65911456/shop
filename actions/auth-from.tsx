'use server';

import { createAuthSession, destroySession, verifyAuth } from '@/lib/auth';
import { Dictionary } from '@/lib/dictionaries';
import { hashUserPassword, verifyPassword } from '@/lib/hash';
import { createUser, getUserByEmail, UserData } from '@/lib/user';
import { redirect } from 'next/navigation';

// 定義錯誤類型
interface SQLiteError extends Error {
    code?: string;
}

// 添加在文件開頭
type AuthResponse = string | { success: boolean; redirect: string };

//註冊
export const signInAction = async (
    prevState: any,
    formData: FormData,
    dict: Dictionary
) => {
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
        return dict.authFrom.error;
    }

    const emailStr = email.toString();
    const passwordStr = password.toString();

    // 驗證 email 格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailStr)) {
        return dict.authFrom.emailError;
    }

    // 驗證密碼長度
    if (passwordStr.length < 8) {
        return dict.authFrom.passwordError;
    }

    const hashedPassword = hashUserPassword(passwordStr);
    try {
        const id = await createUser({
            email: emailStr,
            password: hashedPassword,
            name: '',
            provider: 'local'
        });
        await createAuthSession(id);
    } catch (error) {
        const sqliteError = error as SQLiteError;
        if (sqliteError.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return dict.authFrom.emailUniqueError;
        }
        throw error;
    }

    return null;
};

//登入
export const loginAction = async (
    prevState: any,
    formData: FormData,
    dict: Dictionary
): Promise<AuthResponse> => {
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
        return dict.authFrom.error;
    }

    const emailStr = email.toString();
    const passwordStr = password.toString();

    // 驗證 email 格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailStr)) {
        return dict.authFrom.emailError;
    }

    // 驗證密碼長度
    if (passwordStr.length < 8) {
        return dict.authFrom.passwordError;
    }

    const existingUser = getUserByEmail(emailStr);
    if (!existingUser) {
        return dict.authFrom.emailNotFound;
    }
    if (existingUser.password) {
        const isValidPassword = verifyPassword(existingUser.password, passwordStr);
        if (!isValidPassword) {
            return dict.authFrom.passwordIncorrect;
        }
    }

    try {
        await createAuthSession(existingUser.id.toString());
        return { success: true, redirect: '/' };
    } catch (error) {
        console.error('Login error:', error);
        return dict.authFrom.error;
    }
};

//切換登入或註冊
export const authFormAction = async (
    mode: string,
    prevState: any,
    formData: FormData,
    dict: Dictionary
) => {
    if (mode === 'login') {
        return loginAction(prevState, formData, dict);
    }
    if (mode === 'signin') {
        return signInAction(prevState, formData, dict);
    }
};

//登出
export const logout = async () => {
    try {
        await destroySession();
        return { success: true, redirect: '/' };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: '登出失敗' };
    }
};
