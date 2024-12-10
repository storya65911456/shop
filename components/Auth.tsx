import { verifyAuth } from '@/lib/auth';
import { User } from 'lucia';
import { redirect } from 'next/navigation';
import { ComponentType, ReactElement } from 'react';

// 定義帶有用戶資訊的 Props 介面
interface WithAuthProps {
    user: User;
    [key: string]: any;
}

// 改進 auth HOC 的類型定義
export const auth = <P extends WithAuthProps>(
    Component: ComponentType<P>
): ((props: Omit<P, 'user'>) => Promise<ReactElement>) => {
    return async function AuthenticatedComponent(
        props: Omit<P, 'user'>
    ): Promise<ReactElement> {
        const result = await verifyAuth();

        if (!result.user) {
            redirect('/');
        }

        // 將用戶資訊與原始 props 合併
        return <Component {...(props as P)} user={result.user} />;
    };
};
