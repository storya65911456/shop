import { ProductDetail } from '@/components/ProductDetail';
import { getProductById } from '@/lib/product';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{
        lang: string;
        slug: string;
    }>;
}

export default async function ProductPage({ params }: PageProps) {
    const { lang, slug } = await params;
    const product = getProductById(parseInt(slug));

    if (!product) {
        notFound();
    }

    return (
        <div className='w-[1200px] mx-auto px-4 py-8'>
            <ProductDetail product={product} />
        </div>
    );
}
