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
        redirect(redirectTo);
    }

    return children;
}
