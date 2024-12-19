'use client';

import { Dictionary, Locale } from '@/lib/dictionaries';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { LanguageDropdown } from './LanguageDropdown';

interface LoginHeaderProps {
    lang: Locale;
    dict: Dictionary;
}

export const LoginHeader = ({ lang, dict }: LoginHeaderProps) => {
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
        <header className='p-4 flex justify-between border-b bg-orange'>
            <Link href={`/${lang}`} className='text-white text-2xl font-bold'>
                LOGO
            </Link>
            <LanguageDropdown lang={lang} dict={dict} />
        </header>
    );
};
