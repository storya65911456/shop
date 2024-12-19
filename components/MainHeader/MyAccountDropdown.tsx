'use client';

import { logout } from '@/actions/auth-from';
import { Dictionary, Locale } from '@/lib/dictionaries';
import { UserData } from '@/lib/user';
import Link from 'next/link';

interface MyAccountDropdownProps {
    lang: Locale;
    dict: Dictionary;
    user: UserData | null;
}

export const MyAccountDropdown = ({ lang, dict, user }: MyAccountDropdownProps) => {
    console.log('user', user);
    return (
        <div className='relative group min-w-[100px]'>
            {user ? (
                <>
                    <div className='text-white px-2 py-2 rounded-md text-sm font-medium cursor-pointer flex justify-between items-center'>
                        <button className='flex items-center justify-center w-full'>
                            {user.name || user.email}
                        </button>
                    </div>
                    {/* Dropdown Menu */}
                    <div className='absolute hidden group-hover:flex flex-col right-0 pt-2 w-48'>
                        <div className='bg-white rounded-md shadow-md py-2 z-20'>
                            {/* 小箭頭 */}
                            <div className='absolute top-[3px] right-8 transform translate-y-0 w-3 h-3 bg-white rotate-45'></div>
                            {/* 選單內容 */}
                            <Link
                                href={`/${lang}/account/profile`}
                                className='block px-4 py-2 text-black'
                            >
                                {dict.header.account.profile}
                            </Link>
                            <Link
                                href={`/${lang}/orders`}
                                className='block px-4 py-2 text-black'
                            >
                                {dict.header.account.orders}
                            </Link>
                            <button
                                className='block px-4 py-2 text-black'
                                onClick={() => {
                                    logout();
                                }}
                            >
                                {dict.header.button.logout}
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className='text-white px-2 py-2 rounded-md text-sm font-medium cursor-pointer flex justify-between items-center gap-2'>
                    <Link
                        href={`/${lang}/login?mode=signin`}
                        className='flex items-center justify-center'
                    >
                        {dict.header.button.sign}
                    </Link>
                    <span className='text-gray-100/70'>|</span>
                    <Link
                        href={`/${lang}/login?mode=login`}
                        className='flex items-center justify-center'
                    >
                        {dict.header.button.login}
                    </Link>
                </div>
            )}
        </div>
    );
};
