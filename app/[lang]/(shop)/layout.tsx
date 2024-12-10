import { MainHeader } from '@/components/MainHeader';
import '@/css/globals.css';
import { verifyAuth } from '@/lib/auth';
import { getDictionary } from '@/lib/dictionaries';
import type { ReactNode } from 'react';

interface ShopLayoutProps {
    children: ReactNode;
    params: Promise<{
        lang: string;
    }>;
}

export default async ({ children, params }: ShopLayoutProps) => {
    const { lang } = await params;
    const dict = await getDictionary(lang as 'en' | 'zh-TW');
    const { user } = await verifyAuth();

    return (
        <html lang={lang}>
            <body>
                <MainHeader
                    lang={lang as 'en' | 'zh-TW'}
                    dict={dict}
                    isAuthenticated={!!user}
                />
                {children}
            </body>
        </html>
    );
};
