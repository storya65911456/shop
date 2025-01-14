import Carousel from '@/components/Carousel';

import { verifyAuth } from '@/lib/auth';
import { getDictionary } from '@/lib/dictionaries';
import {
    formatCategoryPath,
    getAllProducts,
    getDirectChildren,
    getMainCategories,
    Product
} from '@/lib/product';
import Image from 'next/image';
import Link from 'next/link';

interface PageProps {
    params: Promise<{
        lang: string;
    }>;
}

const slides = [
    {
        id: 1,
        imageUrl: 'https://via.placeholder.com/800x400?text=Slide+1',
        altText: 'Slide 1'
    },
    {
        id: 2,
        imageUrl: 'https://via.placeholder.com/800x400?text=Slide+2',
        altText: 'Slide 2'
    },
    {
        id: 3,
        imageUrl: 'https://via.placeholder.com/800x400?text=Slide+3',
        altText: 'Slide 3'
    },
    {
        id: 4,
        imageUrl: 'https://via.placeholder.com/800x400?text=Slide+4',
        altText: 'Slide 4'
    },
    {
        id: 5,
        imageUrl: 'https://via.placeholder.com/800x400?text=Slide+5',
        altText: 'Slide 5'
    },
    {
        id: 6,
        imageUrl: 'https://via.placeholder.com/800x400?text=Slide+6',
        altText: 'Slide 6'
    },
    {
        id: 7,
        imageUrl: 'https://via.placeholder.com/800x400?text=Slide+7',
        altText: 'Slide 7'
    }
];

export default async function ShopPage({ params }: PageProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang as 'en' | 'zh-TW');

    const products = getAllProducts();
    const mainCategories = getMainCategories();

    return (
        <main className='w-[1280px] mx-auto px-4 py-6 overflow-auto whitespace-nowrap'>
            {/* 輪播廣告 */}
            <section className='mb-8 flex flex-row h-[300px]'>
                <div className='h-full rounded-lg w-[70%] mr-1'>
                    {/* 輪播組件 */}
                    <Carousel slides={slides} />
                </div>
                <div className='h-full rounded-lg ml-1 w-[30%] flex flex-col'>
                    <div className='h-[50%] bg-gray-100 rounded-lg mb-1'></div>
                    <div className='h-[50%] bg-gray-100 rounded-lg mt-1'></div>
                </div>
            </section>

            {/* 商品分類 */}
            <section className='mb-8'>
                <div className='grid grid-cols-10 gap-4'>
                    {mainCategories.map((category) => {
                        return (
                            <div
                                key={category.id}
                                className='text-center cursor-pointer group relative'
                            >
                                <Link href={`/${lang}/category/${category.id}`}>
                                    <div className='bg-gray-100 rounded-md p-8 mb-2 transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300'>
                                        {/* 分類圖標 */}
                                    </div>
                                    <span>{category.name}</span>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 每日新發現 */}
            <section>
                <h2 className='text-xl font-bold mb-4'>每日新發現</h2>
                <div className='grid grid-cols-6 gap-4'>
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={`/${lang}//${product.id}`}
                            className='border rounded-nd overflow-hidden hover:shadow-lg transition-shadow hover:shadow-orange hover:scale-105'
                        >
                            <div className='aspect-square bg-gray-100'>
                                {/* 商品圖片 */}
                            </div>
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
            </section>
        </main>
    );
}
