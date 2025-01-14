import { verifyAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';

interface AuthProviderProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export async function AuthProvider({
    children,
    redirectTo = '/login'
}: AuthProviderProps) {
    const { user } = await verifyAuth();

    if (!user) {
        console.log('redirecting to login');

        redirect(redirectTo);
    }

    return children;
}
