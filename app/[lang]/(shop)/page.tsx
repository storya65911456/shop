import { verifyAuth } from '@/lib/auth';
import { getDictionary } from '@/lib/dictionaries';
import Image from 'next/image';

interface PageProps {
    params: {
        lang: string;
    };
}

export default async ({ params: { lang } }: PageProps) => {
    const dict = await getDictionary(lang as 'en' | 'zh-TW');
    const { user } = await verifyAuth();

    return (
        <main className='max-w-7xl mx-auto px-4 py-6'>
            {/* 輪播廣告 */}
            <section className='mb-8'>
                <div className='bg-gray-200 h-[300px] rounded-lg'>
                    {/* 這裡放輪播組件 */}
                    輪播廣告
                </div>
            </section>

            {/* 商品分類 */}
            <section className='mb-8'>
                <h2 className='text-xl font-bold mb-4'>商品分類</h2>
                <div className='grid grid-cols-10 gap-4'>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className='text-center'>
                            <div className='bg-gray-100 rounded-lg p-4 mb-2'>
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
