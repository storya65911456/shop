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
        <div className='flex flex-col items-center gap-5 justify-center w-full'>
            {/* 第一個方塊 商品資訊 */}
            <div className='flex items-start gap-2 justify-center w-full bg-gray-100/10 shadow-sm rounded-sm shadow-gray-100/30'>
                {/* 商品圖片區域 - 這裡需要另外實現  450*450 */}
                <div className='w-[480px] p-4'>
                    <div className='w-[450px] h-[450px] bg-gray-100'></div>
                </div>

                {/* 商品資訊區域 */}
                <div className='w-[680px] p-4 pr-8 flex flex-col gap-2 items-start justify-center'>
                    <h1 className='text-2xl font-bold'>{product.name}</h1>
                    {/* 評分區域 */}
                    {product.rating_count > 0 ? (
                        <div className='flex items-center gap-4'>
                            <div className='flex items-center'>
                                <span className='mr-1 text-orange'>
                                    {product.rating_avg.toFixed(1)}
                                </span>
                                {/* TODO: 星星還沒做完 */}
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
                            <span className='text-gray-300'>
                                {product.rating_count} 個評價
                            </span>
                            {/* 分割符號 */}
                            <span className='text-gray-100/70'>|</span>
                            <span className='text-gray-300'>
                                {product.sales_count} 已售出
                            </span>
                        </div>
                    ) : (
                        <div className='mb-4 text-gray-300'>尚無評價</div>
                    )}

                    {/* 價格區域 */}
                    <div className=' bg-white/90 p-3 w-full flex items-center justify-start'>
                        {product.discount_percent < 100 && (
                            <span className='line-through text-black mr-3 text-lg'>
                                ${product.price}
                            </span>
                        )}
                        <span className='text-3xl text-orange'>${actualPrice}</span>
                        {product.discount_percent < 100 && (
                            <span className='ml-3 bg-orange text-white rounded-sm text-sm px-1'>
                                {product.discount_percent / 10}折
                            </span>
                        )}
                    </div>

                    {/* 賣家資訊 */}
                    {/* <div className='mb-6'>
                        <p>賣家：{product.seller?.nickname || product.seller?.name}</p>
                    </div> */}

                    {/* 商品變體選擇器 */}
                    <div className='flex flex-col gap-8 mt-5'>
                        {/* 優惠卷 */}
                        <div className='flex flex-row gap-5 items-center justify-start'>
                            <h3 className='w-[100px]'>賣場優惠卷</h3>
                            <p>優惠卷</p>
                        </div>
                        {/* 運送 */}
                        <div className='flex flex-row gap-5 items-center justify-start'>
                            <h3 className='w-[100px]'>運送</h3>
                            <p>運送</p>
                        </div>
                        {/* 顏色 */}
                        {colors.length > 0 && (
                            <div className='flex flex-row gap-5 items-center justify-start'>
                                <h3 className='w-[100px]'>顏色</h3>
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
                        {/* 尺寸 */}
                        {sizes.length > 0 && (
                            <div className='flex flex-row gap-5 items-center justify-start'>
                                <h3 className='w-[100px]'>尺寸</h3>
                                <SizeSelector
                                    sizes={sizes as string[]}
                                    selected={selectedSize}
                                    onChange={setSelectedSize}
                                />
                            </div>
                        )}
                        {/* 庫存資訊 */}
                        <div className='flex flex-row gap-5 items-center justify-start'>
                            <h3 className='w-[100px]'>庫存</h3>
                            {product.has_variants ? (
                                currentVariant ? (
                                    <p>{currentVariant.stock}</p>
                                ) : (
                                    <p className='text-gray-500'>請選擇商品規格</p>
                                )
                            ) : (
                                <p>{product.variants?.[0]?.stock}</p>
                            )}
                        </div>
                        {/* 數量選擇器 */}
                        <div className='flex flex-row gap-5 items-center justify-start'>
                            <h3 className='w-[100px]'>數量</h3>
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
                                        handleQuantityChange(
                                            parseInt(e.target.value) || 1
                                        )
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
                    </div>
                    {/* 按鈕 */}
                    <div className='flex flex-row gap-5 w-[50%] mt-5'>
                        {/* 加入購物車按鈕 */}
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
            {/* 第二個方塊 賣家資訊 */}
            <div className='w-full p-5 px-8 h-[140px] bg-gray-100/10 shadow-sm rounded-sm shadow-gray-100/30 flex flex-row gap-5'>
                <div className='flex flex-row gap-8 items-start justify-center'>
                    {/* 賣家頭像 */}
                    <div className='flex flex-row gap-3 items-start justify-center h-[100px]'>
                        <div className='w-[100px] h-[100px] bg-gray-100'></div>
                        {/* 賣家資訊 */}
                        <div className='flex flex-col gap-1 items-start justify-between h-full'>
                            <p className='text-white text-xl font-bold'>
                                {product.seller?.nickname || product.seller?.name}
                            </p>
                            <p className='text-gray-400 text-sm'>幾分鐘前上線</p>
                            {/* 按鈕 */}
                            <div className='flex flex-row gap-2 items-center justify-center'>
                                <button className='bg-orange/40 text-white py-1 px-3 hover:bg-orange/80 border-orange border'>
                                    聊聊
                                </button>
                                <button className='bg-gray-400/10 text-gray-400 py-1 px-3 hover:bg-gray-400/40 border-gray-400 border'>
                                    查看賣場
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* 分割符號 | */}
                    <span className='h-full w-[1px] bg-gray-100/70'></span>
                    {/* 賣家評價 */}
                    <div className='flex flex-row gap-10 items-center justify-between mx-auto h-full w-[750px]'>
                        {/* 1 */}
                        <div className='flex flex-col gap-2 items-start justify-between h-[70%] w-[250px]'>
                            <div className='flex flex-row gap-2 items-center justify-between w-full'>
                                <p className='text-gray-400 text-sm'>商品評價</p>
                                <p className='text-orange text-sm'>4.5萬</p>
                            </div>
                            <div className='flex flex-row gap-2 items-center justify-between w-full'>
                                <p className='text-gray-400 text-sm'>商品</p>
                                <p className='text-orange text-sm'>85</p>
                            </div>
                        </div>
                        {/* 2 */}
                        <div className='flex flex-col gap-2 items-start justify-between h-[70%] w-[250px]   '>
                            <div className='flex flex-row gap-2 items-center justify-between w-full'>
                                <p className='text-gray-400 text-sm'>聊聊回應率</p>
                                <p className='text-orange text-sm'>93%</p>
                            </div>
                            <div className='flex flex-row gap-2 items-center justify-between w-full'>
                                <p className='text-gray-400 text-sm'>回應速度</p>
                                <p className='text-orange text-sm'>幾小時內</p>
                            </div>
                        </div>
                        {/* 3 */}
                        <div className='flex flex-col gap-2 items-start justify-between h-[70%] w-[250px]'>
                            <div className='flex flex-row gap-2 items-center justify-between w-full'>
                                <p className='text-gray-400 text-sm'>加入時間</p>
                                <p className='text-orange text-sm'>4年 前</p>
                            </div>
                            <div className='flex flex-row gap-2 items-center justify-between w-full'>
                                <p className='text-gray-400 text-sm'>粉絲</p>
                                <p className='text-orange text-sm'>85</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* 第三個方塊 商品描述 */}
            <div className='mt-8 w-full'>
                <h2 className='text-xl font-bold mb-4'>商品描述</h2>
                <p className='whitespace-pre-line'>{product.description}</p>
            </div>
        </div>
    );
}
