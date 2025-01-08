'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

interface ChecklistItem {
    id: string;
    text: string;
    isCompleted: boolean;
}

interface AddProductContextType {
    checklist: ChecklistItem[];
    updateChecklistItem: (id: string, isCompleted: boolean) => void;
}

const initialChecklist: ChecklistItem[] = [
    { id: 'images', text: '新增至少 3 張圖片', isCompleted: false },
    { id: 'video', text: '新增影片', isCompleted: false },
    { id: 'title', text: '商品名稱的字數需介於 25~100', isCompleted: false },
    { id: 'category', text: '選擇至少 1 個類別', isCompleted: false },
    {
        id: 'description',
        text: '商品描述需填入至少 100 個文字或是 1 張圖片',
        isCompleted: false
    }
];

const AddProductContext = createContext<AddProductContextType | undefined>(undefined);

export function AddProductProvider({ children }: { children: ReactNode }) {
    const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);

    const updateChecklistItem = (id: string, isCompleted: boolean) => {
        setChecklist((prev) =>
            prev.map((item) => (item.id === id ? { ...item, isCompleted } : item))
        );
    };

    return (
        <AddProductContext.Provider value={{ checklist, updateChecklistItem }}>
            {children}
        </AddProductContext.Provider>
    );
}

export function useAddProduct() {
    const context = useContext(AddProductContext);
    if (context === undefined) {
        throw new Error('useAddProduct must be used within a AddProductProvider');
    }
    return context;
}
