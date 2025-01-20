import { verifyAuth } from '@/lib/auth';
import { getProductById } from '@/lib/product';
import { EditProductForm } from './components/EditProductForm';
import { EditProductProvider } from './contexts/EditProductContext';

export default async ({
    params
}: {
    params: Promise<{
        id: string;
        lang: string;
    }>;
}) => {
    const { id } = await params;
    const { user } = await verifyAuth();
    const product = getProductById(Number(id));

    if (!user) {
        return <div>請先登入</div>;
    }

    if (!product) {
        return <div>找不到商品</div>;
    }

    // 確認是否為商品擁有者
    if (product.seller_id !== Number(user.id)) {
        return <div>無權限編輯此商品</div>;
    }
    console.log(product);

    return (
        <div className='w-full min-h-screen bg-gray-100/20 p-6'>
            <div className='max-w-5xl mx-auto'>
                <h1 className='text-2xl font-bold mb-6'>編輯商品</h1>
                <EditProductProvider initialProduct={product}>
                    <EditProductForm />
                </EditProductProvider>
            </div>
        </div>
    );
};
