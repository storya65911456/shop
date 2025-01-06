'use client';

import { useEffect, useRef, useState } from 'react';

interface Section {
    id: string;
    name: string;
    ref: React.MutableRefObject<HTMLDivElement | null>;
}

interface PageProps {
    params: Promise<{
        lang: string;
    }>;
}

export default function AddProductPage({ params }: PageProps) {
    const [activeSection, setActiveSection] = useState('basic');

    const handleClick = () => {
        console.log('Clicked me!');
    };

    const basicRef = useRef<HTMLDivElement>(null);
    const salesRef = useRef<HTMLDivElement>(null);
    const shippingRef = useRef<HTMLDivElement>(null);
    const otherRef = useRef<HTMLDivElement>(null);

    const sections = [
        { id: 'basic', name: '基本資訊', ref: basicRef },
        { id: 'sales', name: '銷售資訊', ref: salesRef },
        { id: 'shipping', name: '運費', ref: shippingRef },
        { id: 'other', name: '其他', ref: otherRef }
    ];

    const handleSectionClick = (sectionId: string) => {
        console.log('Section clicked:', sectionId);
        setActiveSection(sectionId);
        const section = sections.find((s) => s.id === sectionId);
        if (section && section.ref.current) {
            section.ref.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <div className='w-full h-full bg-white rounded-md'>
            <input type='text' placeholder='請輸入商品名稱' />
        </div>
    );
}
