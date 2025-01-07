'use client';

import { useAddProduct } from '../contexts/AddProductContext';

export function WritingTips() {
    const { checklist } = useAddProduct();

    return (
        <div className='bg-white shadow-md h-full w-full rounded-md p-4'>
            <h2 className='text-lg font-medium mb-4'>填寫建議</h2>
            <ul className='space-y-3 text-gray-600'>
                {checklist.map((item) => (
                    <li key={item.id} className='flex items-start'>
                        <span
                            className={`mr-2 flex items-center ${
                                item.isCompleted ? 'text-green-500' : 'text-gray-300'
                            }`}
                        ></span>
                        <span
                            className={
                                item.isCompleted ? 'text-gray-400 line-through' : ''
                            }
                        >
                            {item.text}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
