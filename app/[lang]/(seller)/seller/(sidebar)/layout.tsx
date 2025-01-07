import { SellerHeader } from '@/components/Seller/SellerHeader';
import { SellerSidebar } from '@/components/Seller/SellerSidebar';

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
        <div className='h-screen flex flex-col'>
            {/* Header 固定高度 */}
            <SellerHeader lang={lang as 'en' | 'zh-TW'} dict={dict} />
            {/* 主要內容區域 */}
            <div className='flex-1 flex overflow-hidden'>
                {/* Sidebar - 可獨立滾動 */}
                <div className='w-[180px] flex-none overflow-y-auto'>
                    <SellerSidebar lang={lang} />
                </div>

                {/* 主內容區域 - 可獨立滾動 */}
                <div className='flex-1 overflow-auto'>
                    <div className='min-h-screen w-full px-6 py-4 mt-1 bg-gray-100/10 shadow-gray-800 shadow-inner'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
