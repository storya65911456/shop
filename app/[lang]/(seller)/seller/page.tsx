import { AuthProvider } from '@/components/Auth/AuthProvider';
import { Dictionary } from '@/lib/dictionaries';
import Link from 'next/link';

interface SellerPageProps {
    params: Promise<{
        lang: string;
    }>;
    dict: Dictionary;
}

export default async function SellerPage({ params, dict }: SellerPageProps) {
    const { lang } = await params;
    return (
        <AuthProvider redirectTo={`/${lang}/login`}>
            <div className='max-w-7xl mx-auto px-4 py-8'>
                <h1 className='text-2xl font-bold mb-8'>賣家中心</h1>

                {/* 統計數據 */}
                <div className='grid grid-cols-4 gap-4 mb-8'>
                    <div className='bg-white p-4 rounded-lg shadow'>
                        <h3 className='text-gray-500'>總訂單</h3>
                        <p className='text-2xl font-bold'>0</p>
                    </div>
                    <div className='bg-white p-4 rounded-lg shadow'>
                        <h3 className='text-gray-500'>待處理訂單</h3>
                        <p className='text-2xl font-bold'>0</p>
                    </div>
                    <div className='bg-white p-4 rounded-lg shadow'>
                        <h3 className='text-gray-500'>商品總數</h3>
                        <p className='text-2xl font-bold'>0</p>
                    </div>
                    <div className='bg-white p-4 rounded-lg shadow'>
                        <h3 className='text-gray-500'>總收入</h3>
                        <p className='text-2xl font-bold'>$0</p>
                    </div>
                </div>

                {/* 快捷操作 */}
                <div className='bg-white p-6 rounded-lg shadow mb-8'>
                    <h2 className='text-xl font-bold mb-4'>快捷操作</h2>
                    <div className='grid grid-cols-4 gap-4'>
                        <Link
                            href={`/${lang}/seller/products/new`}
                            className='p-4 border rounded-lg hover:bg-gray-50 text-center'
                        >
                            新增商品
                        </Link>
                        <Link
                            href={`/${lang}/seller/orders`}
                            className='p-4 border rounded-lg hover:bg-gray-50 text-center'
                        >
                            訂單管理
                        </Link>
                        <Link
                            href={`/${lang}/seller/products`}
                            className='p-4 border rounded-lg hover:bg-gray-50 text-center'
                        >
                            商品管理
                        </Link>
                        <Link
                            href={`/${lang}/seller/analytics`}
                            className='p-4 border rounded-lg hover:bg-gray-50 text-center'
                        >
                            數據分析
                        </Link>
                    </div>
                </div>
            </div>
        </AuthProvider>
    );
}
