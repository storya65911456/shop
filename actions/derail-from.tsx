'use server';
import db from '@/db/db';
import { getAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

interface ActionState {
    error?: string;
    success?: boolean;
}

export const updateNicknameAction = async (
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> => {
    const { user } = await getAuth();

    if (!user) {
        return {
            error: '未登入'
        };
    }

    const nickname = formData.get('nickname')?.toString();

    if (!nickname) {
        return {
            error: '暱稱不能為空'
        };
    }

    if (nickname.length > 20) {
        return {
            error: '暱稱不能超過20個字'
        };
    }

    try {
        const stmt = db.prepare('UPDATE users SET nickname = ? WHERE id = ?');
        stmt.run(nickname, user.id);

        // 刷新用户资料页面的缓存
        revalidatePath('/[lang]/account/profile');

        return {
            success: true
        };
    } catch (error) {
        console.error('更新暱稱失敗:', error);
        return {
            error: '更新失敗'
        };
    }
};
