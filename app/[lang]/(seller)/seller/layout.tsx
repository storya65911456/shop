import '@/css/globals.css';
import { getDictionary } from '@/lib/dictionaries';
import { ReactNode } from 'react';
interface SellerLayoutProps {
    children: ReactNode;
    params: Promise<{
        lang: string;
    }>;
}

export default async ({ children, params }: SellerLayoutProps) => {
    const { lang } = await params;
    const dict = await getDictionary(lang as 'en' | 'zh-TW');

    return (
        <html lang={lang}>
            <body className='h-screen w-full'>{children}</body>
        </html>
    );
};
