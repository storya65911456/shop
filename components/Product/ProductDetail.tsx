'use client';

import { Product, ProductVariant } from '@/lib/product';
import { Review } from '@/lib/review';
import freeShippingIcon from '@/public/images/free-shipping.png';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { RatingStars } from './RatingStars';
import { SizeSelector } from './SizeSelector';

interface ProductDetailProps {
    product: Product;
    reviews: Review[];
}

export function ProductDetail({ product, reviews }: ProductDetailProps) {
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);

    // 計算實際售價（四捨五入到整數）
    const actualPrice = Math.round((product.price * product.discount_percent) / 100);

    // 獲取可用的尺寸和顏色
    const sizes = [...new Set(product.variants?.map((v) => v.size).filter(Boolean))];
    const colors = [...new Set(product.variants?.map((v) => v.color).filter(Boolean))];

    // 獲取當前選擇的變體庫存
    const currentVariant = product.variants?.find(
        (v) => v.size === selectedSize && v.color === selectedColor
    );

    // 計算每個星級的評價數量
    const ratingCounts = reviews.reduce((acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    // 根據選擇的評分篩選評價
    const filteredReviews = selectedRating
        ? reviews.filter((review) => review.rating === selectedRating)
        : reviews;

    // 只顯示有評價的星級按鈕
    const availableRatings = Object.keys(ratingCounts)
        .map(Number)
        .sort((a, b) => b - a);

    // 在組件中添加一些調試信息
    // console.log('Product ratings:', {
    //     avg: product.rating_avg,
    //     count: product.rating_count
    // });

    // 處理數量變更
    const handleQuantityChange = (value: number) => {
        const maxStock = currentVariant?.stock || product.variants?.[0]?.stock || 0;
        if (value >= 1 && value <= maxStock) {
            setQuantity(value);
        }
    };

    // 添加 ref 用於評價區域
    const reviewsRef = useRef<HTMLDivElement>(null);

    // 添加滾動到評價區域的函數
    const scrollToReviews = () => {
        reviewsRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
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
                        <div className='flex items-center gap-4 '>
                            <div className='flex items-center'>
                                <span className='mr-1 text-orange'>
                                    {product.rating_avg.toFixed(1)}
                                </span>
                                <RatingStars rating={product.rating_avg} size='lg' />
                            </div>
                            {/* 分割符號 */}
                            <span className='text-gray-100/70'>|</span>
                            <span
                                className='text-gray-300 cursor-pointer hover:opacity-80 underline'
                                onClick={scrollToReviews}
                            >
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

                    {/* 商品變體選擇器 */}
                    <div className='flex flex-col gap-8 mt-5'>
                        {/* 優惠卷 */}
                        <div className='flex flex-row gap-5 items-start justify-start'>
                            <h3 className='w-[100px]'>賣場優惠卷</h3>
                            <p>優惠卷</p>
                        </div>
                        {/* 運送 */}
                        <div className='flex flex-row gap-5 items-start justify-start'>
                            <h3 className='w-[100px]'>運送</h3>
                            <div className='flex flex-col gap-2 items-start justify-start'>
                                <div className='flex flex-row gap-2 items-start justify-start'>
                                    <Image
                                        src={freeShippingIcon}
                                        alt='免運'
                                        width={25}
                                        height={25}
                                    />
                                    <div className='flex flex-col items-start justify-center'>
                                        <p>免運費</p>
                                        <p className='text-sm text-gray-400'>
                                            滿$199，免運費
                                        </p>
                                    </div>
                                </div>
                                <div className='flex flex-row gap-2 items-start justify-start'>
                                    <Image
                                        src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/baa823ac1c58392c2031.svg'
                                        alt='運費'
                                        className='opacity-50 brightness-0 invert'
                                        width={25}
                                        height={25}
                                    />
                                    <div className='flex flex-col gap-3 items-start justify-center'>
                                        <div className='flex flex-row gap-20 items-center justify-center'>
                                            <p>運送 到</p>
                                            <p>運費</p>
                                        </div>
                                        <div className='flex flex-row gap-24 items-center justify-center'>
                                            <p>運費</p>
                                            <p>運費</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 顏色 */}
                        {colors.length > 0 && (
                            <div className='flex flex-row gap-5 items-start justify-start'>
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
                            <div className='flex flex-row gap-5 items-start justify-start'>
                                <h3 className='w-[100px]'>尺寸</h3>
                                <SizeSelector
                                    sizes={sizes as string[]}
                                    selected={selectedSize}
                                    onChange={setSelectedSize}
                                />
                            </div>
                        )}
                        {/* 庫存資訊 */}
                        <div className='flex flex-row gap-5 items-start justify-start'>
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
                        {/* 數量選擇 */}
                        <div className='flex flex-row gap-5 items-start justify-start'>
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
            {/* 下方方塊 + 右側廣告 */}
            <div className='w-full flex flex-row gap-5'>
                {/* 左側 */}
                <div className='w-[80%] flex flex-col gap-5'>
                    {/* 第三個方塊 商品描述 */}
                    <div className='w-full p-4 bg-gray-100/10 shadow-sm rounded-sm shadow-gray-100/30 flex'>
                        <h2 className='text-xl font-bold mb-4'>商品描述</h2>
                        <p className='whitespace-pre-line'>{product.description}</p>
                    </div>
                    {/* 第四個方塊 商品評價 */}
                    <div
                        ref={reviewsRef}
                        className='w-full bg-gray-100/10 shadow-sm rounded-sm shadow-gray-100/30 flex flex-col p-4 gap-4'
                    >
                        <h2 className='text-xl font-bold'>商品評價</h2>
                        {/* 評分統計 */}
                        <div className='flex items-start justify-start flex-row gap-10 w-full bg-gray-100/20 rounded-sm p-4'>
                            {/* 星星 + 分數 */}
                            <div className='flex items-center flex-col'>
                                <div className='flex items-end'>
                                    <span className='text-orange text-2xl font-bold'>
                                        {product.rating_avg.toFixed(1)}
                                    </span>
                                    <p className='text-orange text-lg'>/5</p>
                                </div>
                                <RatingStars rating={product.rating_avg} size='xl' />
                            </div>
                            {/* 評分篩選按鈕 */}
                            <div className='flex gap-3 mt-2'>
                                <button
                                    className={`px-4 py-2 rounded-sm border ${
                                        selectedRating === null
                                            ? 'border-orange text-orange border-2'
                                            : 'border-gray-300'
                                    } hover:border-orange hover:text-orange hover:bg-orange/10`}
                                    onClick={() => setSelectedRating(null)}
                                >
                                    全部
                                </button>
                                {availableRatings.map((stars) => (
                                    <button
                                        key={stars}
                                        className={`px-4 py-2 rounded-sm border ${
                                            selectedRating === stars
                                                ? 'border-orange text-orange border-2'
                                                : 'border-gray-300'
                                        } hover:border-orange hover:text-orange hover:bg-orange/10`}
                                        onClick={() => setSelectedRating(stars)}
                                    >
                                        {stars} 星 ({ratingCounts[stars]})
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 評價列表 */}
                        <div className='mt-4 space-y-4'>
                            {product.rating_count > 0 ? (
                                <>
                                    {filteredReviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className='p-4 border-b border-gray-300/30'
                                        >
                                            <div className='flex items-start gap-4'>
                                                <div className='w-10 h-10 rounded-full bg-gray-300'></div>
                                                <div className='flex-1'>
                                                    <div className='flex items-center gap-2'>
                                                        <span className='font-medium'>
                                                            {review.user.nickname ||
                                                                review.user.name}
                                                        </span>
                                                        <RatingStars
                                                            rating={review.rating}
                                                            size='sm'
                                                        />
                                                    </div>
                                                    <p className='text-gray-400 text-sm mt-1'>
                                                        {new Date(
                                                            review.created_at
                                                        ).toLocaleString()}
                                                    </p>
                                                    <p className='mt-2'>
                                                        {review.comment}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className='mb-4 text-gray-300'>尚無評價</div>
                            )}
                        </div>
                    </div>
                </div>
                {/* 右側 */}
                <div className='w-[20%] bg-gray-100/10 shadow-sm rounded-sm shadow-gray-100/30 flex flex-col p-4 gap-4'>
                    <h2 className='text-xl font-bold'>廣告</h2>
                </div>
            </div>
        </div>
    );
}
