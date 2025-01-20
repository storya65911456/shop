'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FaChevronDown, FaPlus, FaTrash } from 'react-icons/fa6';

// 規格類型定義
export interface Variation {
    name: string; // 規格名稱（顏色/尺寸）
    options: string[]; // 規格選項列表
}

// 規格組合類型定義
export interface VariationCombination {
    color: string; // 顏色選項
    sizes: {
        // 尺寸和庫存組合
        size: string; // 尺寸選項
        stock: string; // 庫存數量
    }[];
}

// 組件 Props 類型定義
interface VariationSelectorProps {
    mode: 'add' | 'edit'; // 組件模式：新增或編輯
    variations: Variation[]; // 規格列表
    onVariationsChange: (
        // 規格變更回調
        variations: Variation[],
        combinations?: VariationCombination[]
    ) => void;
    defaultStock?: string; // 默認庫存數量
    onStockChange?: (stock: string) => void; // 庫存變更回調
    variationStocks: VariationCombination[]; // 現有庫存數據
    onVariationStocksChange: (stocks: VariationCombination[]) => void; // 庫存變更回調
}

// 可選的規格類型
const VARIATION_TYPES = [
    { value: 'color', label: '顏色' },
    { value: 'size', label: '尺寸' }
];

// 生成庫存組合的輔助函數
const generateCombinations = (
    variations: Variation[],
    defaultStock: string
): VariationCombination[] => {
    const colorVariation = variations.find((v) => v.name === '顏色');
    const sizeVariation = variations.find((v) => v.name === '尺寸');

    let result: VariationCombination[] = [];

    if (sizeVariation?.options.length && !colorVariation?.options.length) {
        result = [
            {
                color: '-',
                sizes: sizeVariation.options.map((size) => ({
                    size,
                    stock: defaultStock
                }))
            }
        ];
    } else if (colorVariation?.options.length && !sizeVariation?.options.length) {
        result = colorVariation.options.map((color) => ({
            color,
            sizes: [{ size: '-', stock: defaultStock }]
        }));
    } else if (colorVariation?.options.length && sizeVariation?.options.length) {
        result = colorVariation.options.map((color) => ({
            color,
            sizes: sizeVariation.options.map((size) => ({
                size,
                stock: defaultStock
            }))
        }));
    }

    return result;
};

export function VariationSelector({
    mode,
    variations,
    onVariationsChange,
    defaultStock = '0',
    onStockChange,
    variationStocks,
    onVariationStocksChange
}: VariationSelectorProps) {
    // 狀態管理
    const [isOpen, setIsOpen] = useState<number | null>(null); // 下拉選單開關狀態
    const [newOption, setNewOption] = useState(''); // 新選項輸入值
    const [localStocks, setLocalStocks] =
        useState<VariationCombination[]>(variationStocks); // 本地庫存管理
    const dropdownRef = useRef<HTMLDivElement>(null); // 下拉選單引用

    // 初始化庫存數據
    useEffect(() => {
        if (mode === 'edit') {
            setLocalStocks(variationStocks);
        }
    }, []);

    // 新增規格
    const addVariation = () => {
        if (variations.length >= 2) return; // 最多兩個規格
        onVariationsChange([...variations, { name: '', options: [] }]);
    };

    // 移除規格
    const removeVariation = (index: number) => {
        const newVariations = variations.filter((_, i) => i !== index);
        onVariationsChange(newVariations);
    };

    // 更新規格名稱
    const updateVariationName = (index: number, name: string) => {
        const exists = variations.some((v, i) => i !== index && v.name === name);
        if (exists) return; // 避免重複規格名稱

        const newVariations = [...variations];
        newVariations[index] = { name, options: [] };
        onVariationsChange(newVariations);
    };

    // 更新庫存數量
    const handleStockChange = (colorIndex: number, sizeIndex: number, value: string) => {
        const newStocks = [...localStocks];
        newStocks[colorIndex].sizes[sizeIndex].stock = value;
        setLocalStocks(newStocks);
        onVariationStocksChange(newStocks);
    };

    // 新增規格選項
    const addOption = (variationIndex: number) => {
        if (!newOption.trim()) return;

        const newVariations = [...variations];
        if (newVariations[variationIndex].options.includes(newOption.trim())) {
            setNewOption('');
            return; // 避免重複選項
        }

        newVariations[variationIndex].options.push(newOption.trim());
        onVariationsChange(newVariations);
        setNewOption('');

        // 生成新的庫存組合
        const newCombinations = generateCombinations(newVariations, defaultStock);
        setLocalStocks(newCombinations);
        onVariationStocksChange(newCombinations);
    };

    // 移除規格選項
    const removeOption = (variationIndex: number, optionIndex: number) => {
        const newVariations = [...variations];
        newVariations[variationIndex].options = newVariations[
            variationIndex
        ].options.filter((_, i) => i !== optionIndex);
        onVariationsChange(newVariations);

        // 重新生成庫存組合
        const newCombinations = generateCombinations(newVariations, defaultStock);
        setLocalStocks(newCombinations);
        onVariationStocksChange(newCombinations);
    };

    // 處理點擊外部關閉下拉選單
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // 監聽 variations 變化
    useEffect(() => {
        if (variations.length > 0) {
            const newCombinations = generateCombinations(variations, defaultStock);
            setLocalStocks(newCombinations);
            onVariationStocksChange(newCombinations);
        }
    }, [variations, defaultStock]);

    // 渲染組件
    return (
        <div className='space-y-8'>
            {variations.map((variation, variationIndex) => (
                <div key={variationIndex} className='border rounded-md p-4 space-y-4'>
                    <div className='flex items-center gap-4'>
                        <div className='relative flex-1' ref={dropdownRef}>
                            {variation.name ? (
                                // 已選擇規格類型，顯示固定文字
                                <div className='flex items-center justify-between w-full p-2 bg-gray-200/20 border rounded-md'>
                                    <span className='text-white'>{variation.name}</span>
                                </div>
                            ) : (
                                // 未選擇規格類型，顯示下拉選單
                                <>
                                    <div
                                        onClick={() =>
                                            setIsOpen(
                                                isOpen === variationIndex
                                                    ? null
                                                    : variationIndex
                                            )
                                        }
                                        className={`flex items-center justify-between w-full p-2 bg-gray-200/20 border rounded-md cursor-pointer hover:border-[#ee4d2d] ${
                                            isOpen === variationIndex
                                                ? 'border-[#ee4d2d]'
                                                : ''
                                        }`}
                                    >
                                        <span className='text-gray-400'>
                                            請選擇規格類型
                                        </span>
                                        <FaChevronDown
                                            className={`transition-transform duration-200 ${
                                                isOpen === variationIndex
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
                                    </div>

                                    {isOpen === variationIndex && (
                                        <div className='absolute z-10 w-full mt-1 bg-black border border-gray-700 rounded-md shadow-lg overflow-hidden'>
                                            {VARIATION_TYPES.map((type) => {
                                                const isDisabled = variations.some(
                                                    (v) => v.name === type.label
                                                );
                                                return (
                                                    <div
                                                        key={type.value}
                                                        onClick={() => {
                                                            if (!isDisabled) {
                                                                updateVariationName(
                                                                    variationIndex,
                                                                    type.label
                                                                );
                                                            }
                                                        }}
                                                        className={`px-4 py-2 cursor-pointer ${
                                                            isDisabled
                                                                ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                                                                : 'hover:bg-[#ee4d2d] hover:text-white'
                                                        }`}
                                                    >
                                                        {type.label}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <button
                            type='button'
                            onClick={() => removeVariation(variationIndex)}
                            className='text-gray-400 hover:text-[#ee4d2d] p-2'
                        >
                            <FaTrash size={16} />
                        </button>
                    </div>

                    {variation.name && (
                        <div className='space-y-4'>
                            <div className='flex flex-wrap gap-2'>
                                {variation.options.map((option, optionIndex) => (
                                    <div
                                        key={optionIndex}
                                        className='flex items-center gap-2 bg-gray-200/20 rounded-full px-3 py-1'
                                    >
                                        <span>{option}</span>
                                        <button
                                            type='button'
                                            onClick={() => {
                                                removeOption(variationIndex, optionIndex);
                                            }}
                                            className='text-gray-400 hover:text-[#ee4d2d]'
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className='flex gap-2'>
                                <input
                                    type='text'
                                    value={newOption}
                                    onChange={(e) => setNewOption(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addOption(variationIndex);
                                        }
                                    }}
                                    placeholder={`輸入${variation.name}，例如：${
                                        variation.name === '顏色' ? '紅色' : 'S'
                                    }`}
                                    className='flex-1 p-2 bg-gray-200/20 border rounded-md focus:outline-none focus:border-[#ee4d2d]'
                                />
                                <button
                                    type='button'
                                    onClick={() => addOption(variationIndex)}
                                    className='px-4 py-2 bg-[#ee4d2d] text-white rounded-md hover:bg-[#ff6b4d]'
                                >
                                    新增選項
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {variations.length < 2 && (
                <button
                    type='button'
                    onClick={addVariation}
                    className='flex items-center gap-2 text-[#ee4d2d] hover:text-[#ff6b4d]'
                >
                    <FaPlus size={16} />
                    <span>新增規格</span>
                </button>
            )}

            {/* 規格組合表格 */}
            {variations.some((v) => v.options.length > 0) && (
                <div className='overflow-x-auto'>
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr className='bg-gray-800/50'>
                                <th className='p-3 border border-gray-700 text-left w-[200px]'>
                                    顏色
                                </th>
                                <th className='p-3 border border-gray-700 text-left w-[100px]'>
                                    尺寸
                                </th>
                                <th className='p-3 border border-gray-700 text-left'>
                                    <div className='flex items-center gap-1'>
                                        <span className='text-red-500'>*</span>
                                        商品數量
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {localStocks.map((combination, colorIndex) => (
                                <React.Fragment key={colorIndex}>
                                    {combination.sizes.map((sizeOption, sizeIndex) => (
                                        <tr
                                            key={`${colorIndex}-${sizeIndex}`}
                                            className='hover:bg-gray-800/30'
                                        >
                                            {sizeIndex === 0 && (
                                                <td
                                                    className='p-3 border border-gray-700'
                                                    rowSpan={combination.sizes.length}
                                                >
                                                    {combination.color}
                                                </td>
                                            )}
                                            <td className='p-3 border border-gray-700'>
                                                {sizeOption.size}
                                            </td>
                                            <td className='p-3 border border-gray-700'>
                                                <input
                                                    type='number'
                                                    value={sizeOption.stock}
                                                    onChange={(e) =>
                                                        handleStockChange(
                                                            colorIndex,
                                                            sizeIndex,
                                                            e.target.value
                                                        )
                                                    }
                                                    min='0'
                                                    className='w-full bg-transparent border-b border-gray-600 focus:border-[#ee4d2d] outline-none px-1'
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
