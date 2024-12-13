'use client';

import { authFormAction } from '@/actions/auth-from';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';

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
        <div className='flex flex-row items-center justify-between h-screen overflow-auto whitespace-nowrap max-w-[70%] mx-auto'>
            <div></div>
            <form
                className='w-[400px] h-[516px] mt-8 p-6 bg-white/10 rounded-lg shadow-lg shadow-white/80 mr-5'
                action={formAction}
            >
                <div>
                    <p className='text-center text-2xl font-bold'>
                        {mode === 'login' && dict.authFrom.button.login}
                        {mode === 'signin' && dict.authFrom.button.sign}
                    </p>
                </div>
                <div className='mb-4'>
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
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>
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
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>
                <div className='mb-4'>
                    {state && typeof state === 'string' && (
                        <div className='text-red-500'>{state}</div>
                    )}
                    <button
                        type='submit'
                        className='w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors'
                    >
                        {mode === 'login' && dict.authFrom.button.login}
                        {mode === 'signin' && dict.authFrom.button.sign}
                    </button>
                </div>
                <div className='text-center'>
                    {mode === 'login' && (
                        <Link
                            href={`/${lang}?mode=signin`}
                            className='text-blue-500 hover:text-blue-700 text-sm'
                        >
                            {dict.authFrom.link.sign}
                        </Link>
                    )}
                    {mode === 'signin' && (
                        <Link
                            href={`/${lang}?mode=login`}
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
