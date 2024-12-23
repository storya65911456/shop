'use client';

import { SizeSelector } from '@/components/SizeSelector';
import { Product, ProductVariant } from '@/lib/product';
import { useState } from 'react';

interface ProductDetailProps {
    product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [quantity, setQuantity] = useState(1);

    // 計算實際售價（四捨五入到整數）
    const actualPrice = Math.round((product.price * product.discount_percent) / 100);

    // 獲取可用的尺寸和顏色
    const sizes = [...new Set(product.variants?.map((v) => v.size).filter(Boolean))];
    const colors = [...new Set(product.variants?.map((v) => v.color).filter(Boolean))];

    // 獲取當前選擇的變體庫存
    const currentVariant = product.variants?.find(
        (v) => v.size === selectedSize && v.color === selectedColor
    );

    // 在組件中添加一些調試信息
    console.log('Product ratings:', {
        avg: product.rating_avg,
        count: product.rating_count
    });

    // 處理數量變更
    const handleQuantityChange = (value: number) => {
        const maxStock = currentVariant?.stock || product.variants?.[0]?.stock || 0;
        if (value >= 1 && value <= maxStock) {
            setQuantity(value);
        }
    };

    return (
        <div className='flex flex-col items-center gap-8 justify-center w-full'>
            <div className='flex items-center gap-2 justify-center w-full h-[916px]'>
                {/* 商品圖片區域 - 這裡需要另外實現  450*450 */}
                <div className='bg-gray-100 w-[480px] h-full'>圖片區域</div>

                {/* 商品資訊區域 */}
                <div className='w-[720px] h-full p-5'>
                    <h1 className='text-2xl font-bold mb-4'>{product.name}</h1>

                    {/* 評分區域 */}
                    {product.rating_count > 0 ? (
                        <div className='mb-4 flex items-center gap-4'>
                            <div className='flex items-center'>
                                <span className='mr-1 text-orange'>
                                    {product.rating_avg.toFixed(1)}
                                </span>
                                <div className='flex text-orange'>
                                    {[1, 2, 3, 4, 5].map((index) => {
                                        const diff = product.rating_avg - index + 1;
                                        return (
                                            <span key={index}>
                                                {
                                                    diff >= 0
                                                        ? '★' // 完整星星
                                                        : diff > -1
                                                        ? '&#11240;' // 半星
                                                        : '☆' // 空星
                                                }
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 分割符號 */}
                            <span className='text-gray-100/70'>|</span>
                            <span className='text-gray-500'>
                                {product.rating_count} 個評價
                            </span>
                        </div>
                    ) : (
                        <div className='mb-4 text-gray-500'>尚無評價</div>
                    )}

                    {/* 價格區域 */}
                    <div className='mb-6'>
                        {product.discount_percent < 100 && (
                            <span className='line-through text-gray-500 mr-2'>
                                NT$ {product.price}
                            </span>
                        )}
                        <span className='text-2xl text-red-600'>NT$ {actualPrice}</span>
                        {product.discount_percent < 100 && (
                            <span className='ml-2 text-red-600'>
                                ({100 - product.discount_percent}% OFF)
                            </span>
                        )}
                    </div>

                    {/* 賣家資訊 */}
                    {/* <div className='mb-6'>
                        <p>賣家：{product.seller?.nickname || product.seller?.name}</p>
                    </div> */}

                    {/* 商品變體選擇器 */}
                    {
                        <>
                            {sizes.length > 0 && (
                                <div className='mb-4'>
                                    <h3 className='font-bold mb-2'>尺寸</h3>
                                    <SizeSelector
                                        sizes={sizes as string[]}
                                        selected={selectedSize}
                                        onChange={setSelectedSize}
                                    />
                                </div>
                            )}
                            {colors.length > 0 && (
                                <div className='mb-4'>
                                    <h3 className='font-bold mb-2'>顏色</h3>
                                    <div className='flex gap-2'>
                                        {colors.map((color) => (
                                            <button
                                                key={color}
                                                className={`px-4 py-2 border rounded ${
                                                    selectedColor === color
                                                        ? 'border-orange bg-orange/10 text-orange'
                                                        : 'border-gray-300'
                                                }`}
                                                onClick={() => setSelectedColor(color!)}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    }

                    {/* 庫存資訊 */}
                    <div className='mb-6'>
                        {product.has_variants ? (
                            currentVariant ? (
                                <p>庫存：{currentVariant.stock}</p>
                            ) : (
                                <p className='text-gray-500'>請選擇商品規格</p>
                            )
                        ) : (
                            <p>庫存：{product.variants?.[0]?.stock}</p>
                        )}
                    </div>

                    {/* 數量選���器 */}
                    <div className='mb-6 flex items-center'>
                        <span className='mr-4'>數量：</span>
                        <div className='flex items-center border rounded'>
                            <button
                                className='px-3 py-1 border-1 hover:bg-orange/10 hover:text-orange'
                                onClick={() => handleQuantityChange(quantity - 1)}
                                disabled={quantity <= 1}
                            >
                                -
                            </button>
                            <input
                                type='number'
                                className='w-16 text-center py-1 pl-2 focus:outline-none text-black'
                                value={quantity}
                                onChange={(e) =>
                                    handleQuantityChange(parseInt(e.target.value) || 1)
                                }
                                min={1}
                                max={
                                    currentVariant?.stock ||
                                    product.variants?.[0]?.stock ||
                                    0
                                }
                            />
                            <button
                                className='px-3 py-1 border-l hover:bg-orange/10 hover:text-orange'
                                onClick={() => handleQuantityChange(quantity + 1)}
                                disabled={
                                    quantity >=
                                    (currentVariant?.stock ||
                                        product.variants?.[0]?.stock ||
                                        0)
                                }
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* 加入購物車按鈕 */}
                    <div className='flex flex-row gap-2 w-[50%]'>
                        <button
                            className='w-full bg-orange/40 text-white py-3 rounded-md hover:bg-orange/60 disabled:bg-gray-400/20 disabled:border-none border-orange border'
                            disabled={product.has_variants && !currentVariant}
                        >
                            {product.has_variants && !currentVariant
                                ? '請選擇商品規格'
                                : `加入購物車 (${quantity}件)`}
                        </button>
                        {/* 直接購買 */}
                        <button
                            className='w-full bg-orange/90 text-white py-3 rounded-md hover:bg-orange disabled:bg-gray-400/20'
                            disabled={product.has_variants && !currentVariant}
                        >
                            {product.has_variants && !currentVariant
                                ? '請選擇商品規格'
                                : `直接購買 (${quantity}件)`}
                        </button>
                    </div>
                </div>
            </div>

            {/* 商品描述 */}
            <div className='mt-8 w-full'>
                <h2 className='text-xl font-bold mb-4'>商品描述</h2>
                <p className='whitespace-pre-line'>{product.description}</p>
            </div>
        </div>
    );
}
