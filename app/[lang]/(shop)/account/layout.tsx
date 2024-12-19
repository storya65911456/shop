import { getDictionary } from '@/lib/dictionaries';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { CgProfile } from 'react-icons/cg';

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
        <div className='h-[600px] w-[1280px] mx-auto overflow-auto whitespace-nowrap flex flex-row gap-2'>
            {/* 目錄 */}
            <div className='w-[180px] h-[500px] mt-6'>
                <div className='w-full h-[80px] p-2 flex items-center justify-center'>
                    <CgProfile className='text-6xl w-[30%]' />
                    <div className='w-[80%] text-center'>
                        <p>{dict.account.profile.title}</p>
                    </div>
                </div>
                <div className='w-full h-[400px]'>
                    <ul className='flex flex-col gap-2'>
                        <Link href={`/${lang}/account/profile`}>
                            {dict.account.menu.profile}
                        </Link>
                        <Link href={`/${lang}/account/change-password`}>
                            {dict.account.menu.editPassword}
                        </Link>
                    </ul>
                </div>
            </div>
            {children}
        </div>
    );
};
