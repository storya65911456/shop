'use client';

import { Product } from '@/lib/product';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NotFound() {
    const { lang } = useParams();
    const searchParams = useSearchParams();
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className='w-[1200px] mx-auto px-4 py-8'>
            <div className='text-center mb-8'>
                <h2 className='text-2xl font-bold mb-4'>找不到頁面</h2>
                <p className='text-gray-600 mb-6'>抱歉，您要找的頁面不存在或已被移除。</p>
            </div>
        </div>
    );
}
