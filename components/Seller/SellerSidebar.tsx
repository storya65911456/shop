'use client';

import Link from 'next/link';
import { useState } from 'react';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';

export const SellerSidebar = ({ lang }: { lang: string }) => {
    // 追蹤每個選單的展開狀態
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
        orders: false,
        products: false
    });

    // 切換選單展開狀態
    const toggleMenu = (menuKey: string) => {
        setExpandedMenus((prev) => ({
            ...prev,
            [menuKey]: !prev[menuKey]
        }));
    };

    // 選單配置
    const menuItems = [
        {
            key: 'orders',
            title: '訂單管理',
            items: [
                { name: '我的銷售', route: 'my-sales' },
                { name: '批次出貨', route: 'batch-shipment' },
                { name: '退貨/退款/不成立', route: 'refund' },
                { name: '物流設定', route: 'logistics' }
            ]
        },
        {
            key: 'products',
            title: '商品管理',
            items: [
                { name: '我的商品', route: 'my-product' },
                { name: '新增商品', route: 'add-product' }
            ]
        }
    ];

    return (
        <div className='w-full text-white'>
            {menuItems.map((menu) => (
                <div key={menu.key} className='border-b border-gray-100/30'>
                    {/* 主選單 */}
                    <div
                        className='flex group items-center justify-between p-4 cursor-pointer hover:text-orange'
                        onClick={() => toggleMenu(menu.key)}
                    >
                        <span>{menu.title}</span>
                        {expandedMenus[menu.key] ? (
                            <IoIosArrowDown className='text-white group-hover:text-orange' />
                        ) : (
                            <IoIosArrowForward className='text-white group-hover:text-orange' />
                        )}
                    </div>
                    {/* 子選單 */}
                    {expandedMenus[menu.key] && (
                        <div className=''>
                            {menu.items.map((item) => (
                                <Link
                                    key={item.name}
                                    href={`/${lang}/seller/${item.route}`}
                                    className='block px-8 py-2 text-sm hover:text-orange'
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
