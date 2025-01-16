'use client';

import { updateProductAction } from '@/actions/update-product';
import { CategorySelector } from '@/components/Seller/CategorySelector';
import { useRouter } from 'next/navigation';
import { VariationSelector } from '../../components/VariationSelector';
import { useEditProduct } from '../contexts/EditProductContext';

// 定義 Variation 類型
interface Variation {
    name: string;
    options: string[];
}

export function EditProductForm() {
    const { productData, updateProductData, checklist, originalProduct } =
        useEditProduct();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('productId', String(originalProduct.id));
        formData.append('title', productData.title);
        formData.append('description', productData.description);
        formData.append('price', productData.price);
        formData.append('categories', JSON.stringify(productData.categories));
        formData.append('variations', JSON.stringify(productData.variations));
        formData.append('stock', productData.stock);
        formData.append('variationStocks', JSON.stringify(productData.variationStocks));

        const result = await updateProductAction(formData);
        if (result.error) {
            alert(result.error);
        } else {
            router.push('/seller/my-product');
        }
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-6'>
            {/* 基本資訊 */}
            <div className='bg-black p-6 rounded-lg shadow'>
                <h2 className='text-xl font-semibold mb-4'>基本資訊</h2>

                {/* 商品名稱 */}
                <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2'>商品名稱</label>
                    <input
                        type='text'
                        value={productData.title}
                        onChange={(e) => updateProductData('title', e.target.value)}
                        className='w-full p-2 bg-gray-800 rounded'
                    />
                </div>

                {/* 商品分類 */}
                <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2'>商品分類</label>
                    <CategorySelector
                        value={productData.categories}
                        onChange={(categories) =>
                            updateProductData('categories', categories)
                        }
                    />
                </div>

                {/* 商品描述 */}
                <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2'>商品描述</label>
                    <textarea
                        value={productData.description}
                        onChange={(e) => updateProductData('description', e.target.value)}
                        className='w-full p-2 bg-gray-800 rounded min-h-[200px]'
                    />
                </div>
            </div>

            {/* 規格與庫存 */}
            <div className='bg-black p-6 rounded-lg shadow'>
                <h2 className='text-xl font-semibold mb-4'>規格與庫存</h2>
                <VariationSelector
                    variations={productData.variations}
                    onVariationsChange={(variations: Variation[]) =>
                        updateProductData('variations', variations)
                    }
                    defaultStock={productData.stock}
                    onStockChange={(stock: string) => updateProductData('stock', stock)}
                    variationStocks={productData.variationStocks}
                    onVariationStocksChange={(stocks: {
                        color: string;
                        sizes: { size: string; stock: string }[];
                    }[]) => updateProductData('variationStocks', stocks)}
                />
            </div>

            {/* 價格設定 */}
            <div className='bg-black p-6 rounded-lg shadow'>
                <h2 className='text-xl font-semibold mb-4'>價格設定</h2>
                <div className='flex items-center gap-2'>
                    <span>NT$</span>
                    <input
                        type='number'
                        value={productData.price}
                        onChange={(e) => updateProductData('price', e.target.value)}
                        className='w-32 p-2 bg-gray-800 rounded'
                    />
                </div>
            </div>

            {/* 提交按鈕 */}
            <div className='flex justify-end gap-4'>
                <button
                    type='button'
                    onClick={() => router.back()}
                    className='px-6 py-2 text-gray-400 hover:text-white'
                >
                    取消
                </button>
                <button
                    type='submit'
                    className='px-6 py-2 bg-orange text-white rounded hover:bg-orange/80'
                >
                    更新商品
                </button>
            </div>
        </form>
    );
}
