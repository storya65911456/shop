import type { Locale } from '@/locales/dictionaries';
import { Dictionary, getDictionary } from '@/locales/dictionaries';

interface PageProps {
    params: Promise<{
        lang: Locale;
    }>;
}

export default async function Page({ params }: PageProps) {
    const { lang } = await params;
    const dict = (await getDictionary(lang)) as Dictionary;
    return <button>{dict.products.cart}</button>;
}
