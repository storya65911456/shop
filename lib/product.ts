import db from '@/db/db';

export interface ProductReview {
    id: number;
    product_id: number;
    user_id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    updated_at: string;
    reviewer_name: string;
    reviewer_nickname: string | null;
}

export interface ProductVariant {
    id: number;
    product_id: number;
    size: string | null;
    color: string | null;
    stock: number;
    sku: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    discount_percent: number;
    seller_id: number;
    has_variants: boolean;
    rating_avg: number;
    rating_count: number;
    sales_count: number;
    variants?: ProductVariant[];
    reviews?: ProductReview[];
    seller?: {
        name: string;
        nickname?: string;
    };
    categoryPath?: CategoryPathInfo[];
}

export interface Category {
    id: number;
    name: string;
    description: string;
    parent_id: number | null;
    level: number;
}

export function getProductById(id: number): Product | undefined {
    const product = db
        .prepare(
            `
        SELECT 
            p.*,
            u.name as seller_name,
            u.nickname as seller_nickname,
            COALESCE(
                (SELECT ROUND(AVG(CAST(rating AS FLOAT)), 1)
                FROM product_reviews
                WHERE product_id = p.id),
                0
            ) as rating_avg,
            COALESCE(
                (SELECT COUNT(*)
                FROM product_reviews
                WHERE product_id = p.id),
                0
            ) as rating_count
        FROM products p
        LEFT JOIN users u ON p.seller_id = u.id
        WHERE p.id = ?
    `
        )
        .get(id) as
        | (Product & { seller_name: string; seller_nickname: string | null })
        | undefined;

    if (!product) return undefined;

    // 獲取商品變體
    const variants = db
        .prepare(
            `
        SELECT * FROM product_variants
        WHERE product_id = ?
    `
        )
        .all(id) as ProductVariant[];

    // 獲取評價詳情
    const reviews = db
        .prepare(
            `
    SELECT 
        r.id,
        r.product_id,
        r.user_id,
        r.rating,
        r.comment,
        r.created_at,
        r.updated_at,
        u.name as reviewer_name,
        u.nickname as reviewer_nickname
    FROM product_reviews r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.product_id = ?
    ORDER BY r.created_at DESC
`
        )
        .all(id) as ProductReview[];

    // 獲取分類路徑
    const categoryPath = getProductCategoryPath(id);

    return {
        ...product,
        variants,
        reviews,
        categoryPath,
        seller: {
            name: product.seller_name,
            nickname: product.seller_nickname || undefined
        }
    };
}

export function getAllProducts(): Product[] {
    const products = db
        .prepare(
            `
        SELECT 
            p.*,
            u.name as seller_name,
            u.nickname as seller_nickname,
            COALESCE(
                (SELECT ROUND(AVG(CAST(rating AS FLOAT)), 1)
                FROM product_reviews
                WHERE product_id = p.id),
                0
            ) as rating_avg,
            COALESCE(
                (SELECT COUNT(*)
                FROM product_reviews
                WHERE product_id = p.id),
                0
            ) as rating_count
        FROM products p
        LEFT JOIN users u ON p.seller_id = u.id
        ORDER BY p.created_at DESC
    `
        )
        .all() as (Product & { seller_name: string; seller_nickname: string | null })[];

    return products.map((product) => {
        const variants = db
            .prepare(`SELECT * FROM product_variants WHERE product_id = ?`)
            .all(product.id) as ProductVariant[];

        const categoryPath = getProductCategoryPath(product.id);

        return {
            ...product,
            variants,
            categoryPath,
            seller: {
                name: product.seller_name,
                nickname: product.seller_nickname || undefined
            }
        };
    });
}

// 根據分類名稱獲取分類ID
export function getCategoryIdByName(name: string): number | undefined {
    const category = db
        .prepare(
            `
        SELECT id FROM product_categories
        WHERE name = ?
    `
        )
        .get(name) as { id: number } | undefined;

    return category?.id;
}

// 修改 getProductCategoryPath 函數，返回包含 ID 的完整路徑資訊
export interface CategoryPathInfo {
    name: string;
    id: number;
}

export function getProductCategoryPath(productId: number): CategoryPathInfo[] {
    const categories = db
        .prepare(
            `
        SELECT 
            parent.id as parent_id,
            parent.name as parent_name,
            child.id as child_id,
            child.name as child_name
        FROM product_category_relations pcr
        JOIN product_categories child ON pcr.category_id = child.id
        LEFT JOIN product_categories parent ON child.parent_id = parent.id
        WHERE pcr.product_id = ?
    `
        )
        .get(productId) as
        | {
              parent_id: number | null;
              parent_name: string | null;
              child_id: number;
              child_name: string;
          }
        | undefined;

    if (!categories) return [];

    const result: CategoryPathInfo[] = [];
    if (categories.parent_id && categories.parent_name) {
        result.push({
            id: categories.parent_id,
            name: categories.parent_name
        });
    }
    result.push({
        id: categories.child_id,
        name: categories.child_name
    });

    return result;
}

// 獲取所有主分類
export function getMainCategories(): Category[] {
    return db
        .prepare(
            `
        SELECT * FROM product_categories
        WHERE parent_id IS NULL
        ORDER BY id
    `
        )
        .all() as Category[];
}

// 獲取指定分類的直接子分類
export function getDirectChildren(categoryId: number): Category[] {
    return db
        .prepare(
            `
        SELECT * FROM product_categories
        WHERE parent_id = ?
        ORDER BY id
    `
        )
        .all(categoryId) as Category[];
}

// 獲取分類的所有子分類（包含遞迴子分類）
export function getCategoryChildren(categoryId: number): Category[] {
    return db
        .prepare(
            `
        WITH RECURSIVE subcategories AS (
            -- 起始分類
            SELECT * FROM product_categories
            WHERE id = ?
            
            UNION ALL
            
            -- 遞迴獲取子分類
            SELECT pc.*
            FROM product_categories pc
            JOIN subcategories sc ON pc.parent_id = sc.id
        )
        SELECT * FROM subcategories
        ORDER BY id
    `
        )
        .all(categoryId) as Category[];
}

// 獲取分類的商品數量
export function getCategoryProductCount(categoryId: number): number {
    const result = db
        .prepare(
            `
        SELECT COUNT(*) as count
        FROM product_category_relations
        WHERE category_id = ?
    `
        )
        .get(categoryId) as { count: number };

    return result.count;
}

// 根據分類ID獲取分類資訊
export function getCategoryById(categoryId: number): Category | undefined {
    return db
        .prepare(
            `
        SELECT * FROM product_categories
        WHERE id = ?
    `
        )
        .get(categoryId) as Category | undefined;
}

// 獲取指定分類的所有商品
export function getProductsByCategory(categoryId: number): Product[] {
    const products = db
        .prepare(
            `
        SELECT 
            p.*,
            u.name as seller_name,
            u.nickname as seller_nickname
        FROM products p
        JOIN product_category_relations pcr ON p.id = pcr.product_id
        LEFT JOIN users u ON p.seller_id = u.id
        WHERE pcr.category_id = ? OR pcr.category_id IN (
            SELECT id FROM product_categories WHERE parent_id = ?
        )
        ORDER BY p.created_at DESC
    `
        )
        .all(categoryId, categoryId) as (Product & {
        seller_name: string;
        seller_nickname: string | null;
    })[];

    return products.map((product) => ({
        ...product,
        categoryPath: getProductCategoryPath(product.id),
        seller: {
            name: product.seller_name,
            nickname: product.seller_nickname || undefined
        }
    }));
}

// 根據關鍵字搜索商品
export function searchProducts(keyword: string): Product[] {
    const products = db
        .prepare(
            `
        SELECT 
            p.*,
            u.name as seller_name,
            u.nickname as seller_nickname
        FROM products p
        LEFT JOIN users u ON p.seller_id = u.id
        LEFT JOIN product_category_relations pcr ON p.id = pcr.product_id
        LEFT JOIN product_categories pc ON pcr.category_id = pc.id
        WHERE p.name LIKE ? 
        OR p.description LIKE ?
        OR pc.name LIKE ?
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT 10
    `
        )
        .all(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`) as (Product & {
        seller_name: string;
        seller_nickname: string | null;
    })[];

    return products.map((product) => ({
        ...product,
        categoryPath: getProductCategoryPath(product.id),
        seller: {
            name: product.seller_name,
            nickname: product.seller_nickname || undefined
        }
    }));
}

// 添加一個輔助函數來格式化分類路徑
export function formatCategoryPath(categoryPath: CategoryPathInfo[]): string {
    return categoryPath.map((category) => category.name).join('/');
}
