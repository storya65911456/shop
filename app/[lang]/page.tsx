import type { Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';

interface PageProps {
    params: Promise<{
        lang: Locale;
    }>;
}

interface Dictionary {
    products: {
        cart: string;
    };
}

export default async function Page({ params }: PageProps) {
    const { lang } = await params;
    const dict = (await getDictionary(lang)) as Dictionary;
    return <button>{dict.products.cart}</button>;
}
