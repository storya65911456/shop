import '@/css/globals.css';
import { getDictionary } from '@/lib/dictionaries';

interface SellerLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        lang: string;
    }>;
}

export default async function SellerLayout({ children, params }: SellerLayoutProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang as 'en' | 'zh-TW');

    return (
        <html lang={lang}>
            <body>
                <div className='h-screen w-full'>{children}</div>
            </body>
        </html>
    );
}
