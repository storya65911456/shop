'use client';

import { Dictionary, Locale } from '@/lib/dictionaries';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { GrLanguage } from 'react-icons/gr';

interface LanguageDropdownProps {
    lang: Locale;
    dict: Dictionary;
}

export const LanguageDropdown = ({ lang, dict }: LanguageDropdownProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // 計算目標語言
    const targetLang = lang === 'zh-TW' ? 'en' : 'zh-TW';

    const handleLanguageChange = () => {
        // 獲取當前完整的 search 參數字符串
        const currentSearchParams = searchParams.toString();

        // 保持當前路徑結構，只替換語言部分
        const currentPath = pathname.split('/').filter(Boolean);
        currentPath[0] = targetLang;

        // 組合新的 URL
        const newPath = `/${currentPath.join('/')}`;
        const fullPath = currentSearchParams
            ? `${newPath}?${currentSearchParams}`
            : newPath;

        router.push(fullPath);
    };
    return (
        <div className='relative group'>
            <div className='text-white px-2 py-2 rounded-md text-sm font-medium cursor-pointer flex justify-between items-center'>
                <button className='flex items-center justify-center gap-1'>
                    <GrLanguage className='text-md' />
                    {dict.header.language}
                </button>
            </div>
            {/* Dropdown Menu */}
            <div className='absolute hidden group-hover:flex flex-col right-0 pt-2 w-48'>
                <div className='bg-white rounded-md shadow-md py-2 z-20'>
                    {/* 小箭頭 */}
                    <div className='absolute top-[3px] right-8 transform translate-y-0 w-3 h-3 bg-white rotate-45'></div>
                    {/* 選單內容 */}
                    <button
                        className='block px-4 py-2 text-black'
                        onClick={handleLanguageChange}
                    >
                        {dict.header.languageDropdown['zh-TW']}
                    </button>
                    <button
                        className='block px-4 py-2 text-black'
                        onClick={handleLanguageChange}
                    >
                        {dict.header.languageDropdown['en']}
                    </button>
                </div>
            </div>
        </div>
    );
};
