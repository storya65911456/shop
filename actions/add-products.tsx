'use server';

import { verifyAuth } from '@/lib/auth';
import { createProduct } from '@/lib/create-product';
import { revalidatePath } from 'next/cache';

interface ActionState {
    error?: string;
    success?: boolean;
}

export async function addProductActions(formData: FormData): Promise<ActionState> {
    try {
        const { user } = await verifyAuth();
        if (!user) {
            return { error: '請先登入' };
        }

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const price = formData.get('price') as string;
        const discount_percent = formData.get('discount_percent') as string;
        const categories = JSON.parse(formData.get('categories') as string);
        const variations = JSON.parse(formData.get('variations') as string);
        const stock = formData.get('stock') as string;

        let variationStocks = null;
        const variationStocksData = formData.get('variationStocks');
        if (variationStocksData) {
            variationStocks = JSON.parse(variationStocksData as string);
        }

        // 驗證數據
        if (!title || title.length < 5 || title.length > 100) {
            return { error: '商品名稱需介於 5-100 字元之間' };
        }
        if (!description || description.length < 20) {
            return { error: '商品描述至少需要 20 字元' };
        }
        if (!price || isNaN(Number(price))) {
            return { error: '請輸入有效的價格' };
        }
        if (!categories || categories.length === 0) {
            return { error: '請選擇商品分類' };
        }

        await createProduct({
            title,
            description,
            price: Number(price),
            discount_percent: Number(discount_percent),
            categories,
            variations,
            stock,
            variationStocks,
            userId: Number(user.id)
        });

        revalidatePath('/seller/my-product');
        return { success: true };
    } catch (error) {
        console.error('新增商品失敗:', error);
        return { error: '新增失敗，請稍後再試' };
    }
}
