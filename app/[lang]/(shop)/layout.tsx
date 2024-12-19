import { ContactMenu } from '@/components/ContactMenu';
import { Footer } from '@/components/Footer';
import { MainHeader } from '@/components/MainHeader/MainHeader';
import '@/css/globals.css';
import { verifyAuth } from '@/lib/auth';
import { getDictionary } from '@/lib/dictionaries';
import { UserData } from '@/lib/user';
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
    const { user: authUser } = await verifyAuth();

    // 將 Lucia User 轉換為 UserData 類型
    const user: UserData | null = authUser
        ? {
              id: parseInt(authUser.id),
              name: authUser.name,
              email: authUser.email,
              password: authUser.password,
              google_id: authUser.google_id,
              github_id: authUser.github_id,
              provider: (authUser.provider || 'local') as 'google' | 'github' | 'local'
          }
        : null;

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
};
