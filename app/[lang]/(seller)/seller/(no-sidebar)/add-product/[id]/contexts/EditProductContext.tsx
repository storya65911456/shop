'use client';

import { Product } from '@/lib/product';
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
        discount_percent: initialProduct.discount_percent.toString(),
        variations: initialProduct.has_variants
            ? (() => {
                  const variations = [];
                  // 獲取所有唯一的顏色
                  const colors = [
                      ...new Set(
                          initialProduct.variants
                              ?.filter((v) => v.color)
                              .map((v) => v.color)
                      )
                  ].filter(Boolean) as string[];

                  // 獲取所有唯一的尺寸
                  const sizes = [
                      ...new Set(
                          initialProduct.variants
                              ?.filter((v) => v.size)
                              .map((v) => v.size)
                      )
                  ].filter(Boolean) as string[];

                  // 如果有顏色規格，添加顏色變體
                  if (colors.length > 0) {
                      variations.push({
                          name: '顏色',
                          options: colors
                      });
                  }

                  // 如果有尺寸規格，添加尺寸變體
                  if (sizes.length > 0) {
                      variations.push({
                          name: '尺寸',
                          options: sizes
                      });
                  }

                  return variations;
              })()
            : [],
        stock: initialProduct.has_variants
            ? '0'
            : String(initialProduct.variants?.[0]?.stock || 0),
        price: String(initialProduct.price),
        variationStocks: initialProduct.has_variants
            ? (() => {
                  const stocks = [];
                  const colors = [
                      ...new Set(
                          initialProduct.variants
                              ?.filter((v) => v.color)
                              .map((v) => v.color)
                      )
                  ].filter(Boolean) as string[];

                  const sizes = [
                      ...new Set(
                          initialProduct.variants
                              ?.filter((v) => v.size)
                              .map((v) => v.size)
                      )
                  ].filter(Boolean) as string[];

                  if (colors.length > 0 && sizes.length > 0) {
                      // 同時有顏色和尺寸
                      for (const color of colors) {
                          const sizeStocks = sizes.map((size) => {
                              const variant = initialProduct.variants?.find(
                                  (v) => v.color === color && v.size === size
                              );
                              return {
                                  size,
                                  stock: String(variant?.stock || 0)
                              };
                          });
                          stocks.push({
                              color,
                              sizes: sizeStocks
                          });
                      }
                  } else if (colors.length > 0) {
                      // 只有顏色
                      for (const color of colors) {
                          const variant = initialProduct.variants?.find(
                              (v) => v.color === color
                          );
                          stocks.push({
                              color,
                              sizes: [
                                  {
                                      size: '-',
                                      stock: String(variant?.stock || 0)
                                  }
                              ]
                          });
                      }
                  } else if (sizes.length > 0) {
                      // 只有尺寸
                      stocks.push({
                          color: '-',
                          sizes: sizes.map((size) => {
                              const variant = initialProduct.variants?.find(
                                  (v) => v.size === size
                              );
                              return {
                                  size,
                                  stock: String(variant?.stock || 0)
                              };
                          })
                      });
                  }
                  return stocks;
              })()
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
