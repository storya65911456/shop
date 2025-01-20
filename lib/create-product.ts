import { db } from '@/db/db';

interface VariationStock {
    color: string;
    sizes: {
        size: string;
        stock: string;
    }[];
}

interface CreateProductData {
    title: string;
    description: string;
    price: number;
    discount_percent: number;
    categories: string[];
    stock?: string;
    variations: any[];
    variationStocks: VariationStock[] | null;
    userId: number;
}

export async function createProduct({
    title,
    description,
    price,
    discount_percent,
    categories,
    stock,
    variations,
    variationStocks,
    userId
}: CreateProductData) {
    // 開始資料庫交易
    const transaction = db.transaction(() => {
        // 插入商品基本資料
        const result = db
            .prepare(
                `
            INSERT INTO products (
                name, 
                description, 
                price, 
                discount_percent,
                seller_id,
                has_variants
            ) VALUES (?, ?, ?, ?, ?, ?)
        `
            )
            .run(
                title,
                description,
                price,
                discount_percent,
                userId,
                variations.length > 0 ? 1 : 0
            );

        const productId = result.lastInsertRowid as number;

        // 插入商品分類關聯
        // 根據分類路徑獲取最終分類ID
        let parentId: number | null = null;
        let categoryId: number | null = null;

        // 遍歷分類路徑
        for (const categoryName of categories) {
            const category = db
                .prepare(
                    `
                SELECT id 
                FROM product_categories 
                WHERE name = ? AND parent_id ${parentId === null ? 'IS NULL' : '= ?'}
            `
                )
                .get(parentId === null ? [categoryName] : [categoryName, parentId]) as {
                id: number;
            };

            if (!category) {
                throw new Error(`找不到分類: ${categoryName}`);
            }

            categoryId = category.id;
            parentId = category.id;
        }

        if (!categoryId) {
            throw new Error('無效的分類路徑');
        }

        // 插入商品分類關聯
        db.prepare(
            'INSERT INTO product_category_relations (product_id, category_id) VALUES (?, ?)'
        ).run(productId, categoryId);

        // 處理商品變體和庫存
        if (variations.length > 0 && variationStocks) {
            // 有變體的情況
            for (const variation of variationStocks) {
                for (const sizeData of variation.sizes) {
                    const stockAmount = parseInt(sizeData.stock);
                    if (stockAmount > 0) {
                        const sku = `${productId}-${variation.color}-${sizeData.size}`;
                        db.prepare(
                            `
                            INSERT INTO product_variants (
                                product_id, 
                                color, 
                                size, 
                                stock,
                                sku
                            ) VALUES (?, ?, ?, ?, ?)
                        `
                        ).run(
                            productId,
                            variation.color,
                            sizeData.size,
                            stockAmount,
                            sku
                        );
                    }
                }
            }
        } else if (stock) {
            // 無變體的情況，只有單一庫存
            const sku = `${productId}-default`;
            db.prepare(
                `
                INSERT INTO product_variants (
                    product_id, 
                    stock,
                    sku
                ) VALUES (?, ?, ?)
            `
            ).run(productId, parseInt(stock), sku);
        }

        return productId;
    });

    // 執行交易
    return transaction();
}
