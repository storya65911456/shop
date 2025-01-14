'use client';

import { deleteProductAction } from '@/actions/delete-product';
import { Product } from '@/lib/product';
import Link from 'next/link';
import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { DeleteModal } from './DeleteModal';

interface MyProductPageProps {
    products: Product[];
}

export function MyProductPage({ products }: MyProductPageProps) {
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        productId?: number;
        productName?: string;
    }>({ isOpen: false });

    const handleDelete = async (productId: number) => {
        const result = await deleteProductAction(productId);
        if (result.error) {
            alert(result.error);
        }
        setDeleteModal({ isOpen: false });
    };

    if (!products || products.length === 0) {
        return (
            <div className='text-center text-gray-500'>目前沒有商品，請先新增商品</div>
        );
    }

    return (
        <div className='w-full h-full bg-gray-100/20 p-6 shadow-gray-800 shadow-inner rounded-sm'>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-2xl font-bold'>我的商品</h1>
                <Link
                    href='/seller/add-product'
                    className='px-4 py-2 bg-orange text-white rounded hover:bg-orange/80 transition-colors'
                >
                    新增商品
                </Link>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {products.map((product) => (
                    <div
                        key={product.id}
                        className='bg-black p-4 rounded-lg shadow-gray-800 shadow-md hover:shadow-orange hover:shadow-lg transition-shadow relative group'
                    >
                        {/* 操作按鈕 */}
                        <div className='absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                            <Link
                                href={`/seller/edit-product/${product.id}`}
                                className='p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors'
                                title='編輯商品'
                            >
                                <FaEdit className='w-4 h-4' />
                            </Link>
                            <button
                                className='p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors'
                                title='刪除商品'
                                onClick={() =>
                                    setDeleteModal({
                                        isOpen: true,
                                        productId: product.id,
                                        productName: product.name
                                    })
                                }
                            >
                                <FaTrash className='w-4 h-4' />
                            </button>
                        </div>

                        {/* 商品基本資訊 */}
                        <h2 className='text-lg font-semibold mb-2 pr-16'>
                            {product.name}
                        </h2>

                        {/* 價格資訊 */}
                        <div className='text-gray-400 mb-2'>
                            <span className='text-orange font-semibold'>
                                $
                                {(
                                    product.price *
                                    (product.discount_percent / 100)
                                ).toFixed(2)}
                            </span>
                            {product.discount_percent < 100 && (
                                <span className='line-through ml-2 text-gray-500'>
                                    ${product.price.toFixed(2)}
                                </span>
                            )}
                            {product.discount_percent < 100 && (
                                <span className='ml-2 text-orange'>
                                    ({100 - product.discount_percent}% OFF)
                                </span>
                            )}
                        </div>

                        {/* 評分和銷售資訊 */}
                        <div className='flex gap-4 text-gray-400 mb-2'>
                            <div>
                                評分: {product.rating_avg.toFixed(1)} (
                                {product.rating_count} 則評價)
                            </div>
                            <div>銷售量: {product.sales_count}</div>
                        </div>

                        {/* 庫存資訊 */}
                        <div className='mt-2 text-gray-400'>
                            {product.has_variants ? (
                                <div className='flex items-center gap-2'>
                                    <span>庫存:</span>
                                    <span>
                                        {product.variants?.reduce(
                                            (total, variant) => total + variant.stock,
                                            0
                                        )}
                                    </span>
                                    <span className='text-xs bg-gray-700 px-2 py-1 rounded'>
                                        多規格
                                    </span>
                                </div>
                            ) : (
                                <div>庫存: {product.variants?.[0]?.stock || 0}</div>
                            )}
                        </div>

                        {/* 分類資訊 */}
                        <div className='mt-2 text-sm text-gray-500'>
                            分類:{' '}
                            {product.categoryPath?.map((cat) => cat.name).join(' > ')}
                        </div>
                    </div>
                ))}
            </div>

            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false })}
                onConfirm={() =>
                    deleteModal.productId && handleDelete(deleteModal.productId)
                }
                productName={deleteModal.productName || ''}
            />
        </div>
    );
}
