'use client';

import { Dictionary, Locale } from '@/lib/dictionaries';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { BiLogoInstagramAlt } from 'react-icons/bi';
import { FaLine, FaSearch } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa6';
import { FiShoppingCart } from 'react-icons/fi';

interface MainHeaderProps {
    lang: Locale;
    dict: Dictionary;
    isAuthenticated: boolean;
}

export const MainHeader = ({ lang, dict, isAuthenticated }: MainHeaderProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    return (
        <header className='bg-[#f53d2d]'>
            {/* 上方導航欄 */}
            <div className='max-w-7xl mx-auto px-4 py-2 text-white text-sm'>
                <div className='flex justify-between items-center'>
                    <div className='flex gap-4 justify-center items-center'>
                        <Link href={`/${lang}/seller`}>賣家中心</Link>
                        <Link href={`/${lang}/download`}>下載</Link>
                        <div className='flex items-center gap-2 justify-center'>
                            追蹤我們
                            <FaFacebook className='text-xl' />
                            <BiLogoInstagramAlt className='text-2xl' />
                            <FaLine className='text-xl' />
                        </div>
                    </div>
                    <div className='flex gap-4 items-center justify-center'>
                        <div className='flex items-center gap-2 justify-center'>
                            <span>通知</span>
                            <span>幫助中心</span>
                        </div>
                        {isAuthenticated ? (
                            <div className='flex items-center gap-2'>
                                <span>我的帳戶</span>
                                <button>{dict.authFrom.button.logout}</button>
                            </div>
                        ) : (
                            <div className='flex gap-2'>
                                <Link href={`/${lang}/login`}>
                                    {dict.authFrom.button.login}
                                </Link>
                                <Link href={`/${lang}/signin`}>
                                    {dict.authFrom.button.signin}
                                </Link>
                            </div>
                        )}
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
                        <div className='flex bg-white pl-2 w-[80%] items-center justify-between rounded '>
                            <input
                                type='text'
                                className='py-2 rounded-l-sm mr-4 outline-none w-full '
                                placeholder='搜尋商品'
                            />
                            <button className='bg-[#fb5533] hover:bg-[#f53d2d] h-full transition-colors text-white px-6 py-2 mr-1 rounded flex items-center justify-center'>
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
