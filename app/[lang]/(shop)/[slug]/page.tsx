import { ProductDetail } from '@/components/Product/ProductDetail';
import { getProductById } from '@/lib/product';
import { getProductReviews } from '@/lib/review';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaAngleRight } from 'react-icons/fa';

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

    const reviews = await getProductReviews(product.id);
    const categoryPath = product.categoryPath || [];

    return (
        <div className='w-[1200px] mx-auto p-4 pb-8'>
            <div className='font-bold mb-4 flex items-center justify-start'>
                <div className='flex items-center gap-2'>
                    <Link href={`/${lang}`} className='text-blue-500'>
                        蝦皮購物
                    </Link>
                    <FaAngleRight />
                    {categoryPath.map((category, index) => (
                        <div className='flex items-center gap-2' key={category.id}>
                            <Link
                                href={`/${lang}/category/${category.id}`}
                                className='text-blue-500'
                            >
                                {category.name}
                            </Link>
                            {index < categoryPath.length - 1 && <FaAngleRight />}
                        </div>
                    ))}
                    <FaAngleRight />
                    <p>{product.name}</p>
                </div>
            </div>
            <ProductDetail product={product} reviews={reviews} />
        </div>
    );
}
