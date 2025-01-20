'use server';

import { db } from '@/db/db';
import { verifyAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

interface ActionState {
    error?: string;
    success?: boolean;
}

export async function updateProductAction(formData: FormData) {
    try {
        const { user } = await verifyAuth();
        if (!user) {
            return { error: '請先登入' };
        }

        const productId = formData.get('productId') as string;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const categories = JSON.parse(formData.get('categories') as string);
        const price = formData.get('price') as string;
        const stock = formData.get('stock') as string;
        const variations = JSON.parse(formData.get('variations') as string);
        const variationStocks = JSON.parse(formData.get('variationStocks') as string);
        const discount_percent = formData.get('discount_percent') as string;

        if (!productId) {
            return { error: '商品ID不存在' };
        }

        // 基本驗證
        if (title.length < 5 || title.length > 100) {
            return { error: '商品名稱字數需介於 5~100 字之間' };
        }
        if (categories.length === 0) {
            return { error: '請選擇商品類別' };
        }
        if (description.length < 20) {
            return { error: '商品描述需填入至少 20 個文字' };
        }
        if (!price) {
            return { error: '請輸入商品價格' };
        }
        if (
            discount_percent &&
            (Number(discount_percent) < 0 || Number(discount_percent) > 100)
        ) {
            return { error: '折扣百分比需介於 0~100 之間' };
        }
        console.log(discount_percent);
        // 開始資料庫交易
        const transaction = db.transaction(() => {
            // 更新商品基本資料
            db.prepare(
                `
                UPDATE products 
                SET 
                    name = ?,
                    description = ?,
                    price = ?,
                    has_variants = ?,
                    discount_percent = ?
                WHERE id = ? AND seller_id = ?
            `
            ).run(
                title,
                description,
                parseFloat(price),
                variations.length > 0 ? 1 : 0,
                Number(discount_percent),
                Number(productId),
                Number(user.id)
            );

            // 更新分類關聯
            db.prepare('DELETE FROM product_category_relations WHERE product_id = ?').run(
                Number(productId)
            );

            // 插入新的分類關聯
            let parentId: number | null = null;
            let categoryId: number | null = null;

            for (const categoryName of categories) {
                const category = db
                    .prepare(
                        `
                    SELECT id 
                    FROM product_categories 
                    WHERE name = ? AND parent_id ${parentId === null ? 'IS NULL' : '= ?'}
                `
                    )
                    .get(
                        parentId === null ? [categoryName] : [categoryName, parentId]
                    ) as {
                    id: number;
                };

                if (!category) {
                    throw new Error(`找不到分類: ${categoryName}`);
                }

                categoryId = category.id;
                parentId = category.id;
            }

            if (categoryId) {
                db.prepare(
                    'INSERT INTO product_category_relations (product_id, category_id) VALUES (?, ?)'
                ).run(Number(productId), categoryId);
            }

            // 更新商品變體
            db.prepare('DELETE FROM product_variants WHERE product_id = ?').run(
                Number(productId)
            );

            if (variations.length > 0 && variationStocks) {
                // 有變體的情況
                for (const variation of variationStocks) {
                    for (const sizeData of variation.sizes) {
                        const stockAmount = parseInt(sizeData.stock);
                        if (stockAmount > 0) {
                            const sku = `${productId}-${variation.color}-${sizeData.size}`;
                            db.prepare(
                                `
                                INSERT INTO product_variants (
                                    product_id, 
                                    color, 
                                    size, 
                                    stock,
                                    sku
                                ) VALUES (?, ?, ?, ?, ?)
                            `
                            ).run(
                                Number(productId),
                                variation.color,
                                sizeData.size,
                                stockAmount,
                                sku
                            );
                        }
                    }
                }
            } else if (stock) {
                // 無變體的情況，只有單一庫存
                const sku = `${productId}-default`;
                db.prepare(
                    `
                    INSERT INTO product_variants (
                        product_id, 
                        stock,
                        sku
                    ) VALUES (?, ?, ?)
                `
                ).run(Number(productId), parseInt(stock), sku);
            }
        });

        // 執行交易
        transaction();

        // 重新驗證商品列表頁面
        revalidatePath('/seller/my-product');
        return { success: true };
    } catch (error) {
        console.error('更新商品失敗:', error);
        return { error: '更新失敗，請稍後再試' };
    }
}
