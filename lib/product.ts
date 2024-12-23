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
    variants?: ProductVariant[];
    reviews?: ProductReview[];
    seller?: {
        name: string;
        nickname?: string;
    };
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

    return {
        ...product,
        variants,
        reviews,
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

    // 為每個商品獲取其變體
    return products.map((product) => {
        const variants = db
            .prepare(
                `
            SELECT * FROM product_variants
            WHERE product_id = ?
        `
            )
            .all(product.id) as ProductVariant[];

        return {
            ...product,
            variants,
            seller: {
                name: product.seller_name,
                nickname: product.seller_nickname || undefined
            }
        };
    });
}
