import Carousel from '@/components/Carousel';

import { verifyAuth } from '@/lib/auth';
import { getDictionary } from '@/lib/dictionaries';
import Image from 'next/image';

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

export default async ({ params }: PageProps) => {
    const { lang } = await params;
    const dict = await getDictionary(lang as 'en' | 'zh-TW');

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
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className='text-center cursor-pointer'>
                            <div className='bg-gray-100 rounded-lg p-8 mb-2 transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300'>
                                {/* 分類圖標 */}
                            </div>
                            <span>分類 {i + 1}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* 熱門商品 */}
            <section>
                <h2 className='text-xl font-bold mb-4'>熱門商品</h2>
                <div className='grid grid-cols-6 gap-4'>
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className='border rounded-lg overflow-hidden'>
                            <div className='aspect-square bg-gray-100'>
                                {/* 商品圖片 */}
                            </div>
                            <div className='p-2'>
                                <p className='text-sm line-clamp-2'>商品名稱 {i + 1}</p>
                                <p className='text-[#f53d2d] mt-2'>$ {(i + 1) * 100}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};
