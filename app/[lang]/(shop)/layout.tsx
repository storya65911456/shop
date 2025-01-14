import { ContactMenu } from '@/components/ContactMenu';
import { Footer } from '@/components/Footer';
import { MainHeader } from '@/components/MainHeader/MainHeader';
import '@/css/globals.css';
import { verifyAuth } from '@/lib/auth';
import { getDictionary } from '@/lib/dictionaries';

interface RootLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        lang: string;
    }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang as 'en' | 'zh-TW');
    const { user } = await verifyAuth();

    return (
        <html lang={lang}>
            <body>
                <MainHeader lang={lang as 'en' | 'zh-TW'} dict={dict} user={user} />
                {children}
                <ContactMenu />
                <Footer />
            </body>
        </html>
    );
}
