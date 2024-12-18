import { AuthForm } from '@/components/AuthFrom';
import type { Locale } from '@/lib/dictionaries';
import { Dictionary, getDictionary } from '@/lib/dictionaries';

interface PageProps {
    searchParams: Promise<{
        mode: string;
    }>;
    params: Promise<{
        lang: Locale;
    }>;
}

export default async function Page({ searchParams, params }: PageProps) {
    const { lang } = await params;
    const mode = (await searchParams).mode || 'login';
    const dict = await getDictionary(lang);
    return (
        <>
            <AuthForm dict={dict} lang={lang} mode={mode} />
            <h1>Sign in</h1>
            <a href='/login/github'>Sign in with GitHub</a>
            <br />
            <a href='/login/google'>Sign in with Google</a>
        </>
    );
}
