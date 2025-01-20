'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

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
    discount_percent: string;
    variationStocks: {
        color: string;
        sizes: {
            size: string;
            stock: string;
        }[];
    }[];
}

interface AddProductContextType {
    checklist: ChecklistItem[];
    productData: ProductData;
    updateProductData: (field: keyof ProductData, value: any) => void;
    validateField: (field: string) => void;
}

const initialChecklist: ChecklistItem[] = [
    { id: 'images', text: '新增至少 3 張圖片', isCompleted: false },
    { id: 'video', text: '新增影片', isCompleted: false },
    { id: 'title', text: '商品名稱的字數需介於 5~100', isCompleted: false },
    { id: 'category', text: '選擇完整商品類別', isCompleted: false },
    { id: 'description', text: '商品描述需填入至少 20 個文字', isCompleted: false },
    { id: 'price', text: '請輸入商品價格', isCompleted: false }
];

const initialProductData: ProductData = {
    images: [],
    title: '',
    categories: [],
    description: '',
    video: null,
    variations: [],
    stock: '0',
    price: '',
    discount_percent: '100',
    variationStocks: []
};

const AddProductContext = createContext<AddProductContextType | undefined>(undefined);

export function AddProductProvider({ children }: { children: ReactNode }) {
    const [productData, setProductData] = useState<ProductData>(initialProductData);
    const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);

    const validateField = (field: string) => {
        let isValid = false;

        switch (field) {
            case 'images':
                isValid = productData.images.length >= 3;
                break;
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

    useEffect(() => {
        validateField('images');
    }, [productData.images]);

    useEffect(() => {
        validateField('title');
    }, [productData.title]);

    useEffect(() => {
        if (productData.categories.length > 0) {
            validateField('category');
        }
    }, [productData.categories]);

    useEffect(() => {
        validateField('description');
    }, [productData.description]);

    useEffect(() => {
        validateField('price');
    }, [productData.price]);

    const updateProductData = (field: keyof ProductData, value: any) => {
        setProductData((prev) => {
            return { ...prev, [field]: value };
        });
    };

    return (
        <AddProductContext.Provider
            value={{ checklist, productData, updateProductData, validateField }}
        >
            {children}
        </AddProductContext.Provider>
    );
}

export function useAddProduct() {
    const context = useContext(AddProductContext);
    if (!context) {
        throw new Error('useAddProduct must be used within a AddProductProvider');
    }
    return context;
}
