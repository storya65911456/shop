'use server';

import { verifyAuth } from '@/lib/auth';
import { deleteProduct } from '@/lib/product';
import { revalidatePath } from 'next/cache';

export async function deleteProductAction(productId: number) {
    try {
        const { user } = await verifyAuth();
        if (!user) {
            return { error: '請先登入' };
        }

        const success = deleteProduct(productId, Number(user.id));
        if (!success) {
            return { error: '刪除失敗' };
        }

        revalidatePath('/seller/my-product');
        return { success: true };
    } catch (error) {
        console.error('刪除商品失敗:', error);
        return { error: '刪除失敗，請稍後再試' };
    }
}
