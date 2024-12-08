import type { Locale } from '@/lib/dictionaries';
import type { ReactNode } from 'react';

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
            <body>{children}</body>
        </html>
    );
}
