'use server';

import { Dictionary } from '@/locales/dictionaries';
import { log } from 'node:console';

//註冊
export const signInAction = async (
    prevState: any,
    formData: FormData,
    dict: Dictionary
) => {
    const email = formData.get('email');
    const password = formData.get('password');
    console.log('signInAction');

    if (!email || !password) {
        return dict.authFrom.error;
    }

    // 驗證 email 格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.toString())) {
        return dict.authFrom.emailError;
    }

    // 驗證密碼長度
    if (password.toString().length < 8) {
        return dict.authFrom.passwordError;
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

    console.log('loginAction');

    if (!email || !password) {
        return dict.authFrom.error;
    }

    // 驗證 email 格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.toString())) {
        return dict.authFrom.emailError;
    }

    // 驗證密碼長度
    if (password.toString().length < 8) {
        return dict.authFrom.passwordError;
    }

    return null;
};

//切換
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
