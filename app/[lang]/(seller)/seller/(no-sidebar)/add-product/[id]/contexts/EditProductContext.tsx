'use client';

import { Product } from '@/lib/product';
import { createContext, ReactNode, useContext, useState } from 'react';

interface ChecklistItem {
    id: string;
    text: string;
    isCompleted: boolean;
}

interface ProductData {
    images: File[];
    title: string;
    categories: string[];
    description: string;
    video: File | null;
    variations: any[];
    stock: string;
    price: string;
    variationStocks: {
        color: string;
        sizes: {
            size: string;
            stock: string;
        }[];
    }[];
}

interface EditProductContextType {
    checklist: ChecklistItem[];
    productData: ProductData;
    originalProduct: Product;
    updateProductData: (field: keyof ProductData, value: any) => void;
    validateField: (field: string) => void;
}

const initialChecklist: ChecklistItem[] = [
    { id: 'title', text: '商品名稱的字數需介於 5~100', isCompleted: true },
    { id: 'category', text: '選擇完整商品類別', isCompleted: true },
    { id: 'description', text: '商品描述需填入至少 20 個文字', isCompleted: true },
    { id: 'price', text: '請輸入商品價格', isCompleted: true }
];

const EditProductContext = createContext<EditProductContextType | undefined>(undefined);

export function EditProductProvider({
    children,
    initialProduct
}: {
    children: ReactNode;
    initialProduct: Product;
}) {
    const initialProductData: ProductData = {
        images: [],
        title: initialProduct.name,
        categories: initialProduct.categoryPath?.map((cat) => cat.name) || [],
        description: initialProduct.description,
        video: null,
        variations: initialProduct.has_variants ? initialProduct.variants || [] : [],
        stock: initialProduct.has_variants
            ? '0'
            : String(initialProduct.variants?.[0]?.stock || 0),
        price: String(initialProduct.price),
        variationStocks: initialProduct.has_variants
            ? initialProduct.variants?.map((v) => ({
                  color: v.color || '',
                  sizes: [{ size: v.size || '', stock: String(v.stock) }]
              })) || []
            : []
    };

    const [productData, setProductData] = useState<ProductData>(initialProductData);
    const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);

    const validateField = (field: string) => {
        let isValid = false;

        switch (field) {
            case 'title':
                isValid =
                    productData.title.length >= 5 && productData.title.length <= 100;
                break;
            case 'category':
                isValid = productData.categories.length > 0;
                break;
            case 'description':
                isValid = productData.description.length >= 20;
                break;
            case 'price':
                isValid = !!productData.price && !isNaN(Number(productData.price));
                break;
        }

        setChecklist((prev) => {
            const newChecklist = [...prev];
            const item = newChecklist.find((item) => item.id === field);
            if (item) {
                item.isCompleted = isValid;
            }
            return newChecklist;
        });

        return isValid;
    };

    const updateProductData = (field: keyof ProductData, value: any) => {
        setProductData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <EditProductContext.Provider
            value={{
                checklist,
                productData,
                originalProduct: initialProduct,
                updateProductData,
                validateField
            }}
        >
            {children}
        </EditProductContext.Provider>
    );
}

export function useEditProduct() {
    const context = useContext(EditProductContext);
    if (!context) {
        throw new Error('useEditProduct must be used within a EditProductProvider');
    }
    return context;
}
