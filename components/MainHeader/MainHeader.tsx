'use client';

import { Dictionary, Locale } from '@/lib/dictionaries';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { BiBell, BiLogoInstagramAlt } from 'react-icons/bi';
import { FaFire, FaHistory, FaLine, FaSearch } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa6';
import { FiShoppingCart } from 'react-icons/fi';
import { IoHelpCircleOutline } from 'react-icons/io5';
import { LanguageDropdown } from '../LanguageDropdown';
import { MyAccountDropdown } from './MyAccountDropdown';

interface MainHeaderProps {
    lang: Locale;
    dict: Dictionary;
    isAuthenticated: boolean;
}

export const MainHeader = ({ lang, dict, isAuthenticated }: MainHeaderProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // 根據輸入內容生成建議

    return (
        <header className='bg-orange'>
            {/* 上方導航欄 */}
            <div className='max-w-7xl mx-auto px-4 py-2 text-white text-sm'>
                <div className='flex justify-between items-center'>
                    <div className='flex gap-4 justify-center items-center'>
                        <Link href={`/${lang}/seller`}>{dict.header.button.seller}</Link>
                        {/* 分割符號 | */}
                        <span className='text-gray-100/70'>|</span>
                        <div className='flex items-center gap-2 justify-center'>
                            {dict.header.button.follow}
                            <FaFacebook className='text-xl cursor-pointer' />
                            <BiLogoInstagramAlt className='text-2xl cursor-pointer' />
                            <FaLine className='text-xl cursor-pointer' />
                        </div>
                    </div>
                    <div className='flex gap-4 items-center justify-center'>
                        <div className='flex items-center gap-2 justify-center'>
                            <button className='flex items-center justify-center gap-1 px-2 py-2'>
                                <BiBell className='text-xl' />
                                {dict.header.button.notification}
                            </button>
                            <button className='flex items-center justify-center gap-1 px-2 py-2'>
                                <IoHelpCircleOutline className='text-xl' />
                                {dict.header.button.help}
                            </button>
                            <LanguageDropdown dict={dict} lang={lang} />
                        </div>
                        <MyAccountDropdown
                            dict={dict}
                            lang={lang}
                            isAuthenticated={isAuthenticated}
                        />
                    </div>
                </div>
            </div>

            {/* 搜尋欄 */}
            <div className='max-w-7xl mx-auto px-4 py-4'>
                <div className='flex items-center gap-4'>
                    <Link href={`/${lang}`} className='text-white text-2xl font-bold'>
                        LOGO
                    </Link>
                    <div className='flex-1 flex items-center justify-center'>
                        <div
                            ref={searchRef}
                            className='relative flex bg-white pl-2 w-[80%] items-center justify-between rounded'
                        >
                            <input
                                type='text'
                                className='py-2 rounded-l-sm mr-4 outline-none w-full'
                                placeholder={dict.header.searchPlaceholder || '搜尋商品'}
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                            />
                            <button className='bg-orange hover:bg-[#f53d2d] h-full transition-colors text-white px-6 py-2 mr-1 rounded flex items-center justify-center'>
                                <FaSearch className='text-xl' />
                            </button>
                        </div>
                    </div>
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
