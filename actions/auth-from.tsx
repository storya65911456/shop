'use server';

import { createAuthSession, destroySession } from '@/lib/auth';
import { Dictionary } from '@/lib/dictionaries';
import { hashUserPassword, verifyPassword } from '@/lib/hash';
import { createUser, getUserByEmail, User } from '@/lib/user';
import { redirect } from 'next/navigation';

// 定義錯誤類型
interface SQLiteError extends Error {
    code?: string;
}

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
        const id = createUser(emailStr, hashedPassword);
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

    const existingUser = getUserByEmail(emailStr);
    if (!existingUser) {
        return dict.authFrom.emailNotFound;
    }

    const isValidPassword = verifyPassword(existingUser.password, passwordStr);
    if (!isValidPassword) {
        return dict.authFrom.passwordIncorrect;
    }

    await createAuthSession(existingUser.id);
    redirect('/training');
};

//切換語言
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
    await destroySession();
    redirect('/');
};
