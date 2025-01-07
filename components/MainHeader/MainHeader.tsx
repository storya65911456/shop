'use client';

import { verifyAuth } from '@/lib/auth';
import { Dictionary, Locale } from '@/lib/dictionaries';
import { getUserById, UserData } from '@/lib/user';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { BiBell, BiLogoInstagramAlt } from 'react-icons/bi';
import { FaLine, FaSearch } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa6';
import { FiShoppingCart } from 'react-icons/fi';
import { IoHelpCircleOutline } from 'react-icons/io5';
import { LanguageDropdown } from '../LanguageDropdown';
import { MyAccountDropdown } from './MyAccountDropdown';

interface MainHeaderProps {
    lang: Locale;
    dict: Dictionary;
    user: UserData | null;
}

export const MainHeader = ({ lang, dict, user }: MainHeaderProps) => {
    return (
        <header className='bg-orange shadow-sm shadow-gray-100'>
            {/* 上方導航欄 */}
            <div className='w-[1280px] mx-auto px-4 py-2 text-white text-sm'>
                <div className='flex justify-between items-center'>
                    {/* 左側 */}
                    <div className='flex gap-4 justify-center items-center'>
                        {/* 賣家中心 */}
                        <Link href={`/${lang}/seller/dashboard`}>
                            {dict.header.button.seller}
                        </Link>
                        {/* 分割符號 | */}
                        <span className='text-gray-100/70'>|</span>
                        {/* 追蹤 */}
                        <div className='flex items-center gap-2 justify-center'>
                            {dict.header.button.follow}
                            {/* FB */}
                            <FaFacebook className='text-xl cursor-pointer' />
                            {/* IG */}
                            <BiLogoInstagramAlt className='text-2xl cursor-pointer' />
                            {/* LINE */}
                            <FaLine className='text-xl cursor-pointer' />
                        </div>
                    </div>
                    {/* 右側 */}
                    <div className='flex gap-4 items-center justify-center'>
                        <div className='flex items-center gap-2 justify-center'>
                            {/* 通知 */}
                            <button className='flex items-center justify-center gap-1 px-2 py-2'>
                                <BiBell className='text-xl' />
                                {dict.header.button.notification}
                            </button>
                            {/* 幫助 */}
                            <button className='flex items-center justify-center gap-1 px-2 py-2'>
                                <IoHelpCircleOutline className='text-xl' />
                                {dict.header.button.help}
                            </button>
                            {/* 切換語言 */}
                            <LanguageDropdown dict={dict} lang={lang} />
                        </div>
                        {/* 我的帳戶 */}
                        <MyAccountDropdown dict={dict} lang={lang} user={user} />
                    </div>
                </div>
            </div>

            {/* 搜尋欄 */}
            <div className='w-[1280px] mx-auto px-4 py-4'>
                <div className='flex items-center gap-4'>
                    {/* LOGO */}
                    <Link href={`/${lang}`} className='text-white text-2xl font-bold'>
                        LOGO
                    </Link>
                    {/* 搜尋欄 */}
                    <div className='flex-1 flex items-center justify-center'>
                        <div className='relative flex bg-white pl-2 w-[80%] items-center justify-between rounded'>
                            <input
                                type='text'
                                className='py-2 rounded-l-sm mr-4 outline-none w-full'
                                placeholder={dict.header.searchPlaceholder || '搜尋商品'}
                            />
                            <button className='bg-orange hover:bg-[#f53d2d] h-full transition-colors text-white px-6 py-2 mr-1 rounded flex items-center justify-center'>
                                <FaSearch className='text-xl' />
                            </button>
                        </div>
                    </div>
                    {/* 購物車 */}
                    <div className='text-white'>
                        <Link href={`/${lang}/cart`}>
                            <FiShoppingCart className='text-2xl' />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};
