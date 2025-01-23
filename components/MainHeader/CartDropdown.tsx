'use client';

import { Dictionary, Locale } from '@/lib/dictionaries';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';

// 購物車商品類型
interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    variation?: {
        color?: string;
        size?: string;
    };
}

interface CartDropdownProps {
    lang: Locale;
    dict: Dictionary;
}

export const CartDropdown = ({ lang, dict }: CartDropdownProps) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);

    // 從 localStorage 讀取購物車數據
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            setCartItems(parsedCart);
            calculateTotal(parsedCart);
        }
    }, []);

    // 計算總金額
    const calculateTotal = (items: CartItem[]) => {
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalAmount(total);
    };

    return (
        <div className='group relative min-w-[100px] text-white'>
            <Link href={`/${lang}/cart`} className='relative flex items-center'>
                <FiShoppingCart className='text-3xl' />
                {cartItems.length > 0 && (
                    <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                        {cartItems.length}
                    </span>
                )}
            </Link>

            {/* Dropdown Menu */}
            <div className='absolute hidden group-hover:flex flex-col right-[58px] top-8 pt-2 z-50'>
                <div className='bg-white rounded-md shadow-md py-2 w-[400px]'>
                    {/* 小箭頭 */}
                    <div className='absolute top-[3px] right-4 transform translate-y-0 w-3 h-3 bg-white rotate-45'></div>

                    {/* 內容 */}
                    <div className='max-h-[400px] overflow-y-auto'>
                        {cartItems.length === 0 ? (
                            <div className='flex flex-col items-center justify-center py-8'>
                                <p className='text-center text-gray-500'>購物車是空的</p>
                            </div>
                        ) : (
                            <div className='p-4'>
                                {/* 購物車商品列表 */}
                                <div className='space-y-4'>
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className='flex items-center gap-4 text-gray-800'
                                        >
                                            {/* 商品圖片 */}
                                            <div className='w-16 h-16 bg-gray-100 rounded'>
                                                {item.image && (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={64}
                                                        height={64}
                                                        className='object-cover rounded'
                                                    />
                                                )}
                                            </div>
                                            {/* 商品資訊 */}
                                            <div className='flex-1'>
                                                <p className='text-sm line-clamp-2'>
                                                    {item.name}
                                                </p>
                                                {item.variation && (
                                                    <p className='text-xs text-gray-500'>
                                                        {item.variation.color &&
                                                            `顏色: ${item.variation.color}`}
                                                        {item.variation.size &&
                                                            ` / 尺寸: ${item.variation.size}`}
                                                    </p>
                                                )}
                                                <div className='flex justify-between items-center mt-1'>
                                                    <p className='text-orange'>
                                                        ${item.price}
                                                    </p>
                                                    <p className='text-sm'>
                                                        x{item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* 總計和結帳按鈕 */}
                                <div className='mt-4 pt-4 border-t'>
                                    <div className='flex justify-between items-center mb-4'>
                                        <span className='text-gray-600'>總計</span>
                                        <span className='text-xl text-orange font-semibold'>
                                            ${totalAmount}
                                        </span>
                                    </div>
                                    <Link
                                        href={`/${lang}/cart/checkout`}
                                        className='block w-full bg-orange text-white text-center py-2 rounded hover:bg-[#ff6b4d] transition-colors'
                                    >
                                        結帳
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
