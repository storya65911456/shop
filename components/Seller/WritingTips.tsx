'use client';

import { useAddProduct } from '@/app/[lang]/(seller)/seller/(no-sidebar)/add-product/contexts/AddProductContext';
import { FaCircleCheck } from 'react-icons/fa6';
export function WritingTips() {
    const { checklist } = useAddProduct();

    return (
        <div className='bg-black w-full rounded-md text-white shadow-md shadow-orange'>
            <div className='bg-blue-200/40 p-4 rounded-t-md border-t-4 border-orange mb-4 text-white font-bold text-lg'>
                填寫建議
            </div>
            <ul className='space-y-3 p-4 pt-2'>
                {checklist.map((item) => (
                    <li key={item.id} className='flex items-start'>
                        <span
                            className={`mr-2 flex items-center ${
                                item.isCompleted ? 'text-green-500' : 'text-gray-300'
                            }`}
                        >
                            <FaCircleCheck />
                        </span>
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
