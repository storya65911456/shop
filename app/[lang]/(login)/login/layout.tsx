import { Footer } from '@/components/Footer';
import { LoginHeader } from '@/components/LoginHeader';
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
                <LoginHeader lang={lang} dict={dict} />
                {children}
                <Footer />
            </body>
        </html>
    );
};
