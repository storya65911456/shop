'use client';

import { useEffect, useRef, useState } from 'react';
import { FaChevronDown, FaPlus, FaTrash } from 'react-icons/fa6';

export interface Variation {
    name: string;
    options: string[];
}

export interface VariationCombination {
    color: string;
    sizes: {
        size: string;
        stock: string;
    }[];
}

interface VariationSelectorProps {
    variations: Variation[];
    onVariationsChange: (
        variations: Variation[],
        combinations?: VariationCombination[]
    ) => void;
}

const VARIATION_TYPES = [
    { value: 'color', label: '顏色' },
    { value: 'size', label: '尺寸' }
];

export function VariationSelector({
    variations,
    onVariationsChange
}: VariationSelectorProps) {
    const [isOpen, setIsOpen] = useState<number | null>(null);
    const [newOption, setNewOption] = useState('');
    const [combinations, setCombinations] = useState<VariationCombination[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 生成規格組合
    useEffect(() => {
        const generateCombinations = () => {
            const colorVariation = variations.find((v) => v.name === '顏色');
            const sizeVariation = variations.find((v) => v.name === '尺寸');

            // 如果沒有任何規格，返回空數組
            if (!sizeVariation?.options.length && !colorVariation?.options.length) {
                return [];
            }

            let result: VariationCombination[] = [];

            // 如果只有尺寸規格
            if (sizeVariation?.options.length && !colorVariation?.options.length) {
                result = [
                    {
                        color: '-',
                        sizes: sizeVariation.options.map((size) => ({
                            size,
                            stock: '0'
                        }))
                    }
                ];
            }
            // 如果只有顏色規格
            else if (colorVariation?.options.length && !sizeVariation?.options.length) {
                result = colorVariation.options.map((color) => ({
                    color,
                    sizes: [{ size: '-', stock: '0' }]
                }));
            }
            // 如果同時有顏色和尺寸規格
            else if (colorVariation?.options.length && sizeVariation?.options.length) {
                result = colorVariation.options.map((color) => ({
                    color,
                    sizes: sizeVariation.options.map((size) => ({
                        size,
                        stock: '0'
                    }))
                }));
            }

            return result;
        };

        const newCombinations = generateCombinations();
        setCombinations(newCombinations);
        onVariationsChange(variations, newCombinations);
    }, [variations]);

    // 處理點擊外部關閉
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

    const addVariation = () => {
        if (variations.length >= 2) return;
        onVariationsChange([...variations, { name: '', options: [] }]);
    };

    const removeVariation = (index: number) => {
        const newVariations = variations.filter((_, i) => i !== index);
        onVariationsChange(newVariations);
    };

    const updateVariationName = (index: number, name: string) => {
        // 檢查是否已經有相同類型的規格
        const exists = variations.some((v, i) => i !== index && v.name === name);
        if (exists) return;

        const newVariations = [...variations];
        newVariations[index] = { name, options: [] }; // 重置選項
        onVariationsChange(newVariations);
        setIsOpen(null);
    };

    const addOption = (variationIndex: number) => {
        if (!newOption.trim()) return;

        const newVariations = [...variations];
        // 檢查選項是否已存在
        if (newVariations[variationIndex].options.includes(newOption.trim())) {
            setNewOption('');
            return;
        }

        newVariations[variationIndex].options.push(newOption.trim());
        onVariationsChange(newVariations);
        setNewOption('');
    };

    // 處理庫存數量變更
    const handleStockChange = (colorIndex: number, sizeIndex: number, value: string) => {
        const newCombinations = [...combinations];
        newCombinations[colorIndex].sizes[sizeIndex].stock = value;
        setCombinations(newCombinations);
        onVariationsChange(variations, newCombinations);
    };

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
                                            onClick={() => {
                                                const newVariations = [...variations];
                                                newVariations[variationIndex].options =
                                                    newVariations[
                                                        variationIndex
                                                    ].options.filter(
                                                        (_, i) => i !== optionIndex
                                                    );
                                                onVariationsChange(newVariations);
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
                                            addOption(variationIndex);
                                        }
                                    }}
                                    placeholder={`輸入${variation.name}，例如：${
                                        variation.name === '顏色' ? '紅色' : 'S'
                                    }`}
                                    className='flex-1 p-2 bg-gray-200/20 border rounded-md focus:outline-none focus:border-[#ee4d2d]'
                                />
                                <button
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
                    onClick={addVariation}
                    className='flex items-center gap-2 text-[#ee4d2d] hover:text-[#ff6b4d]'
                >
                    <FaPlus size={16} />
                    <span>新增規格</span>
                </button>
            )}

            {/* 規格組合表格 */}
            {(combinations.length > 0 ||
                variations.some((v) => v.name === '尺寸' && v.options.length > 0)) && (
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
                            {combinations.map((combination, colorIndex) => (
                                <>
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
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
