'use client';

import type { Locale } from '@/i18n.config';
import type { Dictionary } from '@/lib/translations';
import { getDictionary } from '@/lib/translations';
import Link from 'next/link';

interface AuthFormProps {
    lang: Locale;
}

export default async function AuthForm({ lang }: AuthFormProps) {
    const dict = await getDictionary(lang);

    return (
        <form className='max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md'>
            <p className='mb-4'>
                <label
                    htmlFor='email'
                    className='block text-gray-700 text-sm font-bold mb-2'
                >
                    {dict.email}
                </label>
                <input
                    type='email'
                    name='email'
                    id='email'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
            </p>
            <p className='mb-4'>
                <label
                    htmlFor='password'
                    className='block text-gray-700 text-sm font-bold mb-2'
                >
                    {dict.password}
                </label>
                <input
                    type='password'
                    name='password'
                    id='password'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
            </p>
            <p className='mb-4'>
                <button
                    type='submit'
                    className='w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors'
                >
                    {dict.login}
                </button>
            </p>
            <p className='text-center'>
                <Link
                    href={`/${lang}?mode=login`}
                    className='text-blue-500 hover:text-blue-700 text-sm'
                >
                    {dict.loginLink}
                </Link>
            </p>
        </form>
    );
}
