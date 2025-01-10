'use client';

import { useEffect, useRef, useState } from 'react';
import { FaAngleRight } from 'react-icons/fa';
import { FaPen } from 'react-icons/fa6';

interface Category {
    name: string;
    children?: Category[];
}

interface CategorySelectorProps {
    value: string[];
    onChange: (categories: string[]) => void;
}

// 模擬資料庫中的類別資料
const CATEGORIES: Category[] = [
    {
        name: '女生衣著',
        children: [
            {
                name: '上衣',
                children: [
                    { name: '細肩帶/線肩背心' },
                    { name: '平口背心' },
                    { name: 'T恤' },
                    { name: '襯衫' },
                    { name: 'Polo衫' },
                    { name: '連帽衣/包臂衣' },
                    { name: '其他上衣' }
                ]
            },
            {
                name: '長褲/緊身褲',
                children: []
            },
            { name: '短褲', children: [] },
            { name: '裙裝', children: [] }
            // ... 其他子類別
        ]
    },
    {
        name: '男生衣著',
        children: [
            {
                name: '上衣',
                children: [
                    { name: '細肩帶/線肩背心', children: [{ name: '測試' }] },
                    { name: '平口背心' },
                    { name: 'T恤' },
                    { name: '襯衫' },
                    { name: 'Polo衫' },
                    { name: '連帽衣/包臂衣' },
                    { name: '其他上衣' },
                    { name: 'T恤1' },
                    { name: '襯衫1' },
                    { name: 'Polo衫1' },
                    { name: '連帽衣/包臂衣1' },
                    { name: '其他上衣1' }
                ]
            },
            {
                name: '長褲/緊身褲',
                children: []
            },
            { name: '短褲', children: [] },
            { name: '裙裝', children: [] }
        ]
    }
    // ... 其他主類別
];

export const CategorySelector = ({ value, onChange }: CategorySelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState<Category[][]>([CATEGORIES, [], [], []]);
    const [tempValue, setTempValue] = useState<string[]>([]);
    const modalRef = useRef<HTMLDivElement>(null);

    // 當打開選擇器時，初始化臨時值和類別
    useEffect(() => {
        if (isOpen) {
            setTempValue(value);
            let currentCategories = CATEGORIES;
            const newCategories: Category[][] = [CATEGORIES, [], [], []];

            // 遍歷現有的選擇路徑
            for (let i = 0; i < value.length; i++) {
                const currentValue = value[i];
                const nextCategory = currentCategories.find(
                    (c) => c.name === currentValue
                );
                if (nextCategory?.children?.length) {
                    currentCategories = nextCategory.children;
                    newCategories[i + 1] = currentCategories;
                }
            }

            setCategories(newCategories);
        }
    }, [isOpen, value]);

    const handleCategoryClick = (category: Category, level: number) => {
        // 如果點擊的是已選擇的類別，不做任何改變
        if (tempValue[level] === category.name) {
            return;
        }

        const newValue = [...tempValue.slice(0, level), category.name];
        const newCategories = [...categories];

        // 清空後續層級的選項
        for (let i = level + 2; i < categories.length; i++) {
            newCategories[i] = [];
        }

        // 如果有子類別，填充下一層
        if (category.children?.length) {
            newCategories[level + 1] = category.children;
            setCategories(newCategories);
            setTempValue(newValue);
        } else {
            // 選擇最終類別
            setCategories(newCategories);
            setTempValue(newValue);
        }
    };

    // 處理確認按鈕
    const handleConfirm = () => {
        onChange(tempValue);
        setIsOpen(false);
    };

    // 處理取消按鈕
    const handleCancel = () => {
        setTempValue(value);
        setIsOpen(false);
    };

    return (
        <div className='relative'>
            {/* 選擇器按鈕 */}
            <div
                onClick={() => setIsOpen(true)}
                className='w-full p-2 bg-gray-200/20 border rounded-md cursor-pointer hover:border-[#ee4d2d] flex items-center justify-between'
            >
                <span className={value.length ? 'text-white' : 'text-gray-400'}>
                    {value.length ? value.join(' > ') : '選擇商品類別'}
                </span>
                <FaPen className='text-gray-400' />
            </div>

            {/* 選擇器彈窗 */}
            {isOpen && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <div
                        ref={modalRef}
                        className='bg-black w-[960px] h-[560px] rounded-lg shadow-md border border-gray-700 p-6'
                    >
                        {/* 標題列 */}
                        <div className='flex items-center justify-between p-2 mb-2 border-gray-700'>
                            <h3 className='text-xl font-medium'>編輯分類</h3>
                            <button
                                onClick={handleCancel}
                                className='text-gray-400 hover:text-white'
                            >
                                ✕
                            </button>
                        </div>

                        {/* 類別選擇區域 */}
                        <div className='p-2 bg-white/20'>
                            <div className='grid grid-cols-4 gap-4 h-[360px]'>
                                {categories.map((levelCategories, level) => (
                                    <div
                                        key={level}
                                        className='border-r border-gray-700 last:border-r-0 overflow-y-auto'
                                    >
                                        {levelCategories.map((category) => (
                                            <div
                                                key={category.name}
                                                onClick={() =>
                                                    handleCategoryClick(category, level)
                                                }
                                                className={`p-3 cursor-pointer hover:bg-orange/20 flex items-center justify-between ${
                                                    tempValue[level] === category.name
                                                        ? 'text-[#ee4d2d]'
                                                        : ''
                                                }`}
                                            >
                                                <span>{category.name}</span>
                                                {category.children &&
                                                    category.children.length > 0 && (
                                                        <FaAngleRight className='ml-2' />
                                                    )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 底部按鈕 */}
                        <div className='border-gray-700 flex justify-between items-center p-2'>
                            <div className='px-4 pt-4 text-gray-400 font-bold'>
                                {tempValue.join(' > ')}
                            </div>
                            <div className='flex justify-end gap-4 p-4 border-gray-700'>
                                <button
                                    onClick={handleCancel}
                                    className='px-4 py-2 text-gray-400 hover:text-gray-200'
                                >
                                    取消
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className='px-4 py-2 bg-[#ee4d2d] text-white rounded-sm hover:bg-[#ff6b4d]'
                                >
                                    確認
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
