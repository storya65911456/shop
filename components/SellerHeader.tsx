'use client';

import { Dictionary, Locale } from '@/lib/dictionaries';
import { useRouter } from 'next/navigation';
import { LanguageDropdown } from './LanguageDropdown';

interface SellerHeaderProps {
    lang: Locale;
    dict: Dictionary;
}

export const SellerHeader = ({ lang, dict }: SellerHeaderProps) => {
    const router = useRouter();
    return (
        <header className='p-4 flex justify-between border-b'>
            <button
                className='text-blue-500 hover:text-blue-700 bg-white p-2 rounded-md'
                onClick={router.back}
            >
                {dict.header.button.back}
            </button>
            <LanguageDropdown lang={lang} dict={dict} />
        </header>
    );
};
