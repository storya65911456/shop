import { SellerHeader } from '@/components/SellerHeader';

import '@/css/globals.css';
import type { Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import type { ReactNode } from 'react';

interface RootLayoutProps {
    children: ReactNode;
    params: Promise<{
        lang: Locale;
    }>;
}

export const generateStaticParams = () => {
    return [{ lang: 'en' }, { lang: 'zh-TW' }];
};

export default async ({ children, params }: RootLayoutProps) => {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return (
        <html lang={lang}>
            <body>
                <SellerHeader lang={lang} dict={dict} />
                {children}
            </body>
        </html>
    );
};
