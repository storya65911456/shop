'use client';

import { authFormAction } from '@/actions/auth-from-login';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa';

interface AuthFormProps {
    dict: Dictionary;
    lang: Locale;
    mode: string;
}

export const AuthForm = ({ dict, lang, mode }: AuthFormProps) => {
    const router = useRouter();
    const [state, formAction] = useActionState(
        (prevState: any, formData: FormData) =>
            authFormAction(mode, prevState, formData, dict),
        null
    );

    useEffect(() => {
        if (state && typeof state === 'object' && 'success' in state) {
            router.back();
        }
    }, [state, router]);

    return (
        <div className='flex flex-row items-center justify-between h-[600px] overflow-auto whitespace-nowrap max-w-[70%] mx-auto '>
            {/* 圖片 */}
            <div></div>
            {/* 表單 */}
            <form
                className='w-[400px] h-[450px] mt-8 p-6 bg-white rounded-lg shadow-lg shadow-gray-500/90 mr-5'
                action={formAction}
            >
                <div>
                    <p className='text-center text-2xl font-extrabold text-black'>
                        {mode === 'login' && dict.authFrom.button.login}
                        {mode === 'signin' && dict.authFrom.button.sign}
                    </p>
                </div>
                {/* 表單 */}
                <div className='mt-6'>
                    {/* 信箱 */}
                    <div className='mb-2'>
                        <label
                            htmlFor='email'
                            className='block text-gray-700 text-sm font-bold mb-2'
                        >
                            {dict.authFrom.email}
                        </label>
                        <input
                            type='email'
                            name='email'
                            placeholder={dict.authFrom.emailPlaceholder}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange'
                        />
                    </div>
                    {/* 密碼 */}
                    <div className='mb-4'>
                        <label
                            htmlFor='password'
                            className='block text-gray-700 text-sm font-bold mb-2'
                        >
                            {dict.authFrom.password}
                        </label>
                        <input
                            type='password'
                            name='password'
                            placeholder={dict.authFrom.passwordPlaceholder}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange'
                        />
                    </div>

                    <div className='mb-2'>
                        {/* 錯誤訊息 */}
                        {state && typeof state === 'string' && (
                            <div className='text-red-500'>{state}</div>
                        )}
                        {/* 按鈕 */}
                        <button
                            type='submit'
                            className='w-full bg-orange text-white font-bold py-2 px-4 rounded-md hover:bg-[#f53d2d] transition-colors'
                        >
                            {mode === 'login' && dict.authFrom.button.login}
                            {mode === 'signin' && dict.authFrom.button.sign}
                        </button>
                    </div>
                </div>
                {/* 分隔線 */}
                <div className='relative mt-4 mb-4'>
                    <div className='absolute inset-0 flex items-center'>
                        <div className='w-full border-t border-gray-300' />
                    </div>
                    <div className='relative flex justify-center text-sm'>
                        <span className='px-2 text-gray-500 bg-white'>
                            {dict.authFrom.divider}
                        </span>
                    </div>
                </div>
                {/* 社交媒體登入按鈕 */}
                <div className='flex flex-row items-center justify-center gap-2 mb-4'>
                    <Link
                        href={`/${lang}/login/google`}
                        className='flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange'
                    >
                        <FaGoogle className='w-5 h-5 mr-2 text-red-500' />
                        Google
                    </Link>

                    <Link
                        href={`/${lang}/login/github`}
                        className='flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange'
                    >
                        <FaGithub className='w-5 h-5 mr-2' />
                        Github
                    </Link>
                </div>
                {/* 切換登入/註冊連結 */}
                <div className='text-center'>
                    {mode === 'login' && (
                        <Link
                            href={`/${lang}/login?mode=signin`}
                            className='text-blue-500 hover:text-blue-700 text-sm'
                        >
                            {dict.authFrom.link.sign}
                        </Link>
                    )}
                    {mode === 'signin' && (
                        <Link
                            href={`/${lang}/login?mode=login`}
                            className='text-blue-500 hover:text-blue-700 text-sm'
                        >
                            {dict.authFrom.link.login}
                        </Link>
                    )}
                </div>
            </form>
        </div>
    );
};
