'use client';

import { Variation, VariationSelector } from '@/components/Seller/VariationSelector';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { FaImage, FaTrash } from 'react-icons/fa6';
import { useAddProduct } from './contexts/AddProductContext';

const sections = [
    { id: 'basic', name: '基本資訊' },
    { id: 'sales', name: '銷售資訊' },
    { id: 'shipping', name: '運費' },
    { id: 'other', name: '其他' },
    { id: 'saveForm', name: '儲存' }
];

export default function AddProductPage() {
    const { updateChecklistItem } = useAddProduct();
    const [images, setImages] = useState<File[]>([]);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [video, setVideo] = useState<File | null>(null);
    const [activeSection, setActiveSection] = useState('basic');
    const [variations, setVariations] = useState<Variation[]>([]);

    // 監聽圖片數量變化
    useEffect(() => {
        updateChecklistItem('images', images.length >= 3);
    }, [images.length]);

    // 監聽標題長度變化
    useEffect(() => {
        updateChecklistItem('title', title.length >= 25 && title.length <= 100);
    }, [title.length]);

    // 監聽類別狀態變化
    useEffect(() => {
        updateChecklistItem('category', !!category);
    }, [category]);

    // 監聽影片狀態�化
    useEffect(() => {
        if (video) {
            updateChecklistItem('video', true);
        }
    }, [video]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                threshold: 0.5,
                rootMargin: '-80px 0px 0px 0px'
            }
        );

        sections.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // 處理圖片上傳
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files);
            setImages((prev) => [...prev, ...newImages]);
        }
    };

    // 處理影片上傳
    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideo(e.target.files[0]);
        }
    };

    // 添加刪除圖片的處理函數
    const handleDeleteImage = (index: number) => {
        setImages((prev) => {
            const newImages = [...prev];
            newImages.splice(index, 1);
            return newImages;
        });
    };

    return (
        <div className='space-y-6 min-w-[1000px]'>
            {/* 導覽列 */}
            <nav className='sticky top-0 bg-black z-10 border-b shadow-md rounded-sm shadow-orange'>
                <div className='flex gap-4 text-white'>
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={`px-4 py-3 relative cursor-pointer transition-colors duration-300 ${
                                activeSection === section.id
                                    ? 'text-[#ee4d2d] font-medium'
                                    : 'hover:text-[#ee4d2d]'
                            }`}
                        >
                            {section.name}
                            {activeSection === section.id && (
                                <div className='absolute bottom-0 left-0 w-full h-0.5 bg-[#ee4d2d] transition-all duration-300'></div>
                            )}
                        </button>
                    ))}
                </div>
            </nav>

            {/* 基本資訊區塊 */}
            <div id='basic' className='bg-black rounded-md p-6 shadow-md shadow-orange'>
                <h2 className='text-2xl font-medium mb-6'>基本資訊</h2>

                {/* 商品圖片上傳區 */}
                <div className='mb-6 flex flex-row gap-4'>
                    {/* 左邊 */}
                    <div className='flex items-start justify-end mb-2 w-[150px]'>
                        <span className='text-red-500 mr-1'>*</span>
                        <span>商品圖片</span>
                    </div>
                    {/* 右邊 */}
                    <div className='flex flex-col gap-4'>
                        <div>1 : 1 比例圖片</div>
                        <div className='flex gap-4 flex-wrap'>
                            {/* 主圖上傳按鈕 */}
                            <label className='w-[120px] h-[120px] border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-[#ee4d2d] hover:bg-[#fef6f5]'>
                                <input
                                    type='file'
                                    accept='image/*'
                                    multiple
                                    className='hidden'
                                    onChange={handleImageUpload}
                                />
                                <div className='text-center'>
                                    <div className='text-4xl text-gray-400'>+</div>
                                    <div className='text-sm text-gray-500'>
                                        新增圖片
                                        <br />({images.length}/9)
                                    </div>
                                </div>
                            </label>

                            {/* 已上傳的圖片預覽 */}
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className='relative w-[120px] h-[120px] group'
                                >
                                    <div className='relative w-full h-full'>
                                        <Image
                                            src={URL.createObjectURL(image)}
                                            alt={`商品圖片 ${index + 1}`}
                                            fill
                                            className='object-cover rounded-md'
                                        />
                                    </div>
                                    {/* 懸停時顯示的刪除按鈕 */}
                                    <div className='absolute inset-0 bg-black bg-opacity-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center'>
                                        <button
                                            onClick={() => handleDeleteImage(index)}
                                            className='text-white p-2 hover:text-[#ee4d2d] transition-colors duration-200'
                                        >
                                            <FaTrash size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 行銷圖片上傳區 */}
                <div className='mb-6 flex flex-row gap-4'>
                    {/* 左邊 */}
                    <div className='flex items-start justify-end mb-2 w-[150px]'>
                        <span className='text-red-500 mr-1'>*</span>
                        <span>行銷活動圖片</span>
                    </div>
                    {/* 右邊 */}
                    <label className='w-[120px] h-[120px] border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-[#ee4d2d] hover:bg-[#fef6f5]'>
                        <input type='file' accept='image/*' className='hidden' />
                        <div className='text-center'>
                            <div className='text-4xl text-gray-400'>+</div>
                            <div className='text-sm text-gray-500'>
                                新增圖片
                                <br />
                                (0/1)
                            </div>
                        </div>
                    </label>
                </div>

                {/* 商品影片上傳區 */}
                <div className='mb-6 flex flex-row gap-4'>
                    {/* 左邊 */}
                    <div className='flex items-start justify-end mb-2 w-[150px]'>
                        <span>商品影片</span>
                    </div>
                    {/* 右邊 */}
                    <label className='w-[120px] h-[120px] border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-[#ee4d2d] hover:bg-[#fef6f5]'>
                        <input
                            type='file'
                            accept='video/*'
                            className='hidden'
                            onChange={handleVideoUpload}
                        />
                        <div className='text-center'>
                            <div className='text-4xl text-gray-400'>+</div>
                            <div className='text-sm text-gray-500'>新增影片</div>
                        </div>
                    </label>
                </div>

                {/* 商品名稱輸入區 */}
                <div className='mb-6 flex flex-row gap-4'>
                    {/* 左邊 */}
                    <div className='flex items-start justify-end mb-2 w-[150px] mt-2'>
                        <span className='text-red-500 mr-1'>*</span>
                        <span>商品名稱</span>
                    </div>
                    {/* 右邊 */}
                    <div className='flex flex-col gap-2'>
                        <input
                            type='text'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className='w-[700px] bg-gray-200/20 p-2 border rounded-md focus:outline-none focus:border-[#ee4d2d]'
                            placeholder='商品名稱 + 類型 + 重要功能(材質 / 顏色 / 尺寸 / 規格)'
                        />
                        <div className='text-right text-sm text-gray-500'>
                            {title.length}/100
                        </div>
                    </div>
                </div>

                {/* 商品類別輸入區 */}
                <div className='mb-6 flex flex-row gap-4'>
                    {/* 左邊 */}
                    <div className='flex items-center justify-end mb-2 w-[150px]'>
                        <span className='text-red-500 mr-1'>*</span>
                        <span>類別</span>
                    </div>
                    {/* 右邊 */}
                    <div className='w-[700px] flex flex-col gap-2'>
                        <input
                            type='text'
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className='w-full p-2 bg-gray-200/20 border rounded-md focus:outline-none focus:border-[#ee4d2d] text-black'
                            placeholder='選擇商品類別'
                        />
                    </div>
                </div>

                {/* 商品描述輸入區 */}
                <div className='mb-6 flex flex-row gap-4'>
                    {/* 左邊 */}
                    <div className='flex items-start justify-end mb-2 w-[150px]'>
                        <span className='text-red-500 mr-1'>*</span>
                        <span>商品描述</span>
                    </div>
                    {/* 右邊 */}
                    <div className='w-[700px] flex flex-col gap-2'>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className='w-full h-[200px] bg-gray-200/20 p-2 border rounded-md focus:outline-none focus:border-[#ee4d2d] resize-none'
                            placeholder='請輸入商品描述'
                        />

                        <div className='flex text-sm justify-end'>
                            <div className='text-gray-500'>{description.length}/3000</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 銷售資訊區塊 */}
            <div
                id='sales'
                className='bg-black shadow-md shadow-orange rounded-md p-6 h-fit'
            >
                <h2 className='text-2xl font-medium mb-6'>銷售資訊</h2>

                {/* 商品規格選擇區 */}
                <div className='mb-6 flex flex-row gap-4'>
                    {/* 左邊 */}
                    <div className='flex items-start justify-end mb-2 w-[150px]'>
                        <span className='text-red-500 mr-1'>*</span>
                        <span>商品規格</span>
                    </div>
                    {/* 右邊 */}
                    <div className='w-[700px]'>
                        <VariationSelector
                            variations={variations}
                            onVariationsChange={setVariations}
                        />
                    </div>
                </div>
                {/* 商品價格選擇區 */}
                <div className='mb-6 flex flex-row gap-4'>
                    {/* 左邊 */}
                    <div className='flex items-center justify-end mb-2 w-[150px]'>
                        <span className='text-red-500 mr-1'>*</span>
                        <span>商品價格</span>
                    </div>
                    {/* 右邊 */}
                    <div className='w-[200px] relative'>
                        <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
                            NT$
                        </span>
                        <input
                            type='text'
                            value={price}
                            onChange={(e) => {
                                // 只允許輸入數字
                                const value = e.target.value.replace(/[^\d]/g, '');
                                setPrice(value);
                            }}
                            className='w-full p-2 pl-12 bg-gray-200/20 border rounded-md focus:outline-none focus:border-[#ee4d2d] text-white'
                            placeholder='請輸入'
                        />
                    </div>
                </div>

                {/* 銷售資訊表單內容 */}
            </div>

            {/* 運費區塊 */}
            <div
                id='shipping'
                className='bg-black shadow-md shadow-orange rounded-md p-6 h-[500px]'
            >
                <h2 className='text-2xl font-medium mb-6'>運費</h2>
                {/* 運費設定表單內容 */}
            </div>

            {/* 其他區塊 */}
            <div
                id='other'
                className='bg-black shadow-md shadow-orange rounded-md p-6 h-[500px]'
            >
                <h2 className='text-2xl font-medium mb-6'>其他</h2>
                {/* 其他設定表單內容 */}
            </div>
            {/* 儲存表單 */}
            <div
                id='saveForm'
                className='bg-black shadow-md shadow-orange rounded-md p-4 h-fit'
            >
                <div className='flex justify-end gap-4'>
                    <button className='p-2 text-gray-400 hover:text-gray-200 transition-colors duration-200'>
                        取消
                    </button>
                    <button className='p-2 text-gray-400 hover:text-gray-200 transition-colors duration-200'>
                        儲存並下架
                    </button>
                    <button className='p-2 bg-[#ee4d2d] text-white rounded-sm hover:bg-[#ff6b4d] transition-colors duration-200'>
                        儲存並上架
                    </button>
                </div>
            </div>
        </div>
    );
}
