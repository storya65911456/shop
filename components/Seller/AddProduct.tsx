'use client';

import { useAddProduct } from '@/app/[lang]/(seller)/seller/(no-sidebar)/add-product/contexts/AddProductContext';
import { useEffect } from 'react';

export function AddProduct() {
    const { updateChecklistItem } = useAddProduct();

    // 模擬表單狀態
    const title = ''; // 這裡應該是您實際的標題
    const video = null; // 這裡應該是您實際的影片
    const description = ''; // 這裡應該是您實際的品牌描述
    const category = ''; // 這裡應該是您實際的品牌類別

    // 監聽表單狀態變化並更新檢查清單
    useEffect(() => {
        // 檢查影片
        updateChecklistItem('video', !!video);

        // 檢查標題長度
        updateChecklistItem('title', title.length >= 25 && title.length <= 100);

        // 檢查名稱
        updateChecklistItem('category', !!category);

        // 檢查品牌資訊
        updateChecklistItem('description', !!description);
    }, [video, title, category, description, updateChecklistItem]);

    return <div>{/* 您的表單內容 */}</div>;
}
