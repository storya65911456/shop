import { SellerSidebar } from '@/components/Seller/SellerSidebar';
import { SellerHeader } from '@/components/SellerHeader';
import '@/css/globals.css';
import { getDictionary } from '@/lib/dictionaries';
import type { ReactNode } from 'react';

interface accountLayoutProps {
    children: ReactNode;
    params: Promise<{
        lang: string;
    }>;
}

export default async ({ children, params }: accountLayoutProps) => {
    const { lang } = await params;
    const dict = await getDictionary(lang as 'en' | 'zh-TW');

    return (
        <html lang={lang}>
            <body className='h-screen w-full'>
                <SellerHeader lang={lang as 'en' | 'zh-TW'} dict={dict} />
                <div className='flex'>
                    {/* 側邊欄目錄 */}
                    <div className='min-w-[180px] flex flex-col'>
                        <SellerSidebar lang={lang} />
                    </div>
                    <div className='w-full h-full bg-gray-100/10 px-6 py-4 shadow-inner shadow-gray-800 -z-40'>
                        {children}
                    </div>
                </div>
            </body>
        </html>
    );
};
