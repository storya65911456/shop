import { Header } from '@/components/Header';
import type { Locale } from '@/locales/dictionaries';
import type { ReactNode } from 'react';
import '../globals.css';

interface RootLayoutProps {
    children: ReactNode;
    params: Promise<{
        lang: Locale;
    }>;
}

export async function generateStaticParams() {
    return [{ lang: 'en' }, { lang: 'zh-TW' }];
}

export default async function Root({ children, params }: RootLayoutProps) {
    const { lang } = await params;
    return (
        <html lang={lang}>
            <body>
                <Header lang={lang} />
                {children}
            </body>
        </html>
    );
}
