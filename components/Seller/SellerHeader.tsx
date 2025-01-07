'use client';

import { LanguageDropdown } from '@/components/LanguageDropdown';
import { Dictionary, Locale } from '@/lib/dictionaries';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiShopee } from 'react-icons/si';

interface SellerHeaderProps {
    lang: Locale;
    dict: Dictionary;
}

export const SellerHeader = ({ lang, dict }: SellerHeaderProps) => {
    const pathname = usePathname();

    // 解析路徑並生成麵包屑
    const getBreadcrumbs = () => {
        const paths = pathname.split('/').filter(Boolean);
        const breadcrumbs = [];

        // 首頁
        breadcrumbs.push({
            name: '賣家中心',

            path: `/${lang}/seller`
        });

        // 根據路徑映射顯示名稱
        const pathNameMap: Record<string, string> = {
            'my-product': '我的商品',
            'add-product': '新增商品',
            'my-sales': '我的銷售',
            'batch-shipment': '批次出貨',
            refund: '退貨/退款/不成立',
            logistics: '物流設定'
        };

        // 添加當前頁面
        const currentPath = paths[paths.length - 1];
        if (currentPath && pathNameMap[currentPath]) {
            breadcrumbs.push({
                name: pathNameMap[currentPath],
                path: pathname
            });
        }

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <header className='flex flex-col border-b min-w-[800px] shadow-md shadow-orange'>
            {/* 上方區域 */}
            <div className='p-4 flex justify-between items-center'>
                {/* 回到賣場 */}
                <div className='flex items-center gap-2'>
                    <Link
                        href={`/${lang}`}
                        className='text-orange hover:text-orange/80 p-1 rounded-md font-bold text-xl'
                    >
                        LOGO
                    </Link>
                    {/* 分隔線 */}
                    <span className='bg-gray-200/50 h-full w-[1px] mx-4'>&nbsp;</span>
                    {/* 麵包屑導航 */}
                    <div className='px-4 py-2 flex items-center gap-2 text-gray-600'>
                        {breadcrumbs.map((crumb, index) => (
                            <div key={crumb.path} className='flex items-center'>
                                {index > 0 && (
                                    <span className='mx-2 text-gray-400'>&gt;</span>
                                )}
                                <Link
                                    href={crumb.path}
                                    className={`hover:text-orange ${
                                        index === breadcrumbs.length - 1
                                            ? 'text-orange'
                                            : ''
                                    }`}
                                >
                                    {crumb.name}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 切換語言 */}
                <LanguageDropdown lang={lang} dict={dict} />
            </div>
        </header>
    );
};
