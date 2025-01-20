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

// 添加必要的類型定義
interface VariationCombination {
    color: string;
    sizes: {
        size: string;
        stock: string;
    }[];
}

export function EditProductForm() {
    const { productData, updateProductData, originalProduct } = useEditProduct();
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
        formData.append('discount_percent', productData.discount_percent);

        const result = await updateProductAction(formData);
        if (result.error) {
            alert(result.error);
        } else {
            router.push('/seller/my-product');
        }
    };

    // 處理規格變更
    const handleVariationsChange = (variations: Variation[], combinations?: any) => {
        // 更新規格
        updateProductData('variations', variations);

        // 如果沒有新的組合數據，則根據現有規格生成新的組合
        if (!combinations) {
            const newCombinations = generateCombinations(
                variations,
                '0',
                productData.variationStocks // 傳入現有的庫存數據
            );
            updateProductData('variationStocks', newCombinations);
        } else {
            updateProductData('variationStocks', combinations);
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
                    mode='edit'
                    variations={productData.variations}
                    onVariationsChange={handleVariationsChange}
                    defaultStock={productData.stock}
                    onStockChange={(stock) => updateProductData('stock', stock)}
                    variationStocks={productData.variationStocks}
                    onVariationStocksChange={(stocks) => {
                        updateProductData('variationStocks', stocks);
                    }}
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
            {/* 折扣 */}
            <div className='bg-black p-6 rounded-lg shadow'>
                <h2 className='text-xl font-semibold mb-4'>折扣</h2>
                <div className='flex items-center gap-2'>
                    <input
                        type='number'
                        placeholder='0-100'
                        min='0'
                        max='100'
                        value={productData.discount_percent}
                        onChange={(e) => {
                            const value = Math.min(
                                100,
                                Math.max(0, Number(e.target.value))
                            );
                            updateProductData('discount_percent', value.toString());
                        }}
                        className='w-32 p-2 bg-gray-800 rounded'
                    />
                    <span>%</span>
                    {productData.price && productData.discount_percent !== '100' && (
                        <div className='ml-4 text-orange'>
                            折扣後價格：$
                            {Math.round(
                                (Number(productData.price) *
                                    Number(productData.discount_percent)) /
                                    100
                            )}
                        </div>
                    )}
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

// 生成庫存組合的輔助函數
const generateCombinations = (
    variations: Variation[],
    defaultStock: string,
    existingStocks: VariationCombination[] = []
): VariationCombination[] => {
    const colorVariation = variations.find((v) => v.name === '顏色');
    const sizeVariation = variations.find((v) => v.name === '尺寸');

    let result: VariationCombination[] = [];

    // 輔助函數：查找現有庫存
    const findExistingStock = (color: string, size: string): string => {
        const colorStock = existingStocks.find((s) => s.color === color);
        if (colorStock) {
            const sizeStock = colorStock.sizes.find((s) => s.size === size);
            if (sizeStock) {
                return sizeStock.stock;
            }
        }
        return defaultStock;
    };

    if (sizeVariation?.options.length && !colorVariation?.options.length) {
        result = [
            {
                color: '-',
                sizes: sizeVariation.options.map((size) => ({
                    size,
                    stock: findExistingStock('-', size)
                }))
            }
        ];
    } else if (colorVariation?.options.length && !sizeVariation?.options.length) {
        result = colorVariation.options.map((color) => ({
            color,
            sizes: [
                {
                    size: '-',
                    stock: findExistingStock(color, '-')
                }
            ]
        }));
    } else if (colorVariation?.options.length && sizeVariation?.options.length) {
        result = colorVariation.options.map((color) => ({
            color,
            sizes: sizeVariation.options.map((size) => ({
                size,
                stock: findExistingStock(color, size)
            }))
        }));
    }

    return result;
};
