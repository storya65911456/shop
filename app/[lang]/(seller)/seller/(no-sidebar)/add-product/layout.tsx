import { SellerHeader } from '@/components/Seller/SellerHeader';
import { WritingTips } from '@/app/[lang]/(seller)/seller/(no-sidebar)/add-product/components/WritingTips';
import { AddProductProvider } from './contexts/AddProductContext';

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
        <AddProductProvider>
            <div className='h-screen flex flex-col'>
                <SellerHeader lang={lang as 'en' | 'zh-TW'} dict={dict} />

                <div className='flex-1 flex overflow-hidden mt-1 bg-gray-100/10 shadow-gray-800 shadow-inner'>
                    <div className='w-[320px] h-fit flex py-4 pl-6'>
                        <WritingTips />
                    </div>

                    <div className='flex-1 overflow-auto'>
                        <div className='min-h-screen w-full px-6 py-4'>{children}</div>
                    </div>
                </div>
            </div>
        </AddProductProvider>
    );
};
