'use client';

import { Dictionary, Locale } from '@/lib/dictionaries';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface HeaderProps {
    lang: Locale;
    dict: Dictionary;
}

export const Header = ({ lang, dict }: HeaderProps) => {
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
        <header className='p-4 flex justify-between border-b'>
            <button
                className='text-blue-500 hover:text-blue-700 bg-white p-2 rounded-md'
                onClick={router.back}
            >
                {dict.authFrom.button.back}
            </button>
            <button
                className='text-blue-500 hover:text-blue-700 bg-white p-2 rounded-md'
                onClick={handleLanguageChange}
            >
                {lang === 'zh-TW' ? 'English' : '中文'}
            </button>
        </header>
    );
};
