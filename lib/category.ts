import { db } from '@/db/db';

export interface Category {
    name: string;
    children?: Category[];
}

// 獲取分類樹狀結構
export function getCategoryTree() {
    // 獲取所有分類
    const categories = db
        .prepare(
            `WITH RECURSIVE category_tree AS (
                SELECT 
                    id,
                    name,
                    parent_id,
                    0 as level
                FROM product_categories 
                WHERE parent_id IS NULL
                
                UNION ALL
                
                SELECT 
                    pc.id,
                    pc.name,
                    pc.parent_id,
                    ct.level + 1
                FROM product_categories pc
                JOIN category_tree ct ON pc.parent_id = ct.id
            )
            SELECT * FROM category_tree
            ORDER BY level, id`
        )
        .all();

    // 將扁平結構轉換為樹狀結構
    const buildCategoryTree = (
        categories: any[],
        parentId: number | null = null
    ): Category[] => {
        return categories
            .filter((cat) => cat.parent_id === parentId)
            .map((cat) => ({
                name: cat.name,
                children: buildCategoryTree(categories, cat.id)
            }));
    };

    return buildCategoryTree(categories as any[]);
}
