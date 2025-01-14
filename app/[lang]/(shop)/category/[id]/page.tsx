import { getCategoryById, getProductsByCategory } from '@/lib/product';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{
        lang: string;
        id: string;
    }>;
}

export default async ({ params }: PageProps) => {
    const { lang, id } = await params;
    const category = getCategoryById(parseInt(id));

    if (!category) {
        notFound();
    }

    const products = getProductsByCategory(parseInt(id));

    return (
        <div className='w-[1200px] mx-auto px-4 py-8'>
            <h1 className='text-2xl font-bold mb-6'>{category.name}</h1>
            <div className='grid grid-cols-5 gap-4'>
                {products.map((product) => (
                    <Link
                        key={product.id}
                        href={`/${lang}/${product.id}`}
                        className='border rounded-md overflow-hidden hover:shadow-lg transition-shadow'
                    >
                        <div className='aspect-square bg-gray-100'></div>
                        <div className='p-2'>
                            <p className='text-sm line-clamp-2'>{product.name}</p>
                            <p className='text-[#f53d2d] mt-2'>
                                ${product.price.toLocaleString()}
                            </p>
                            <p className='text-xs text-gray-400 mt-1'>
                                已售出 {product.sales_count}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
