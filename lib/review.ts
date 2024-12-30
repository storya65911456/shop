import db from '@/db/db';

export interface Review {
    id: number;
    user_id: number;
    rating: number;
    comment: string;
    created_at: string;
    user: {
        name: string;
        nickname: string;
    };
}

export async function getProductReviews(productId: number): Promise<Review[]> {
    const rows = db
        .prepare(
            `
            SELECT 
                pr.id,
                pr.user_id,
                pr.rating,
                pr.comment,
                pr.created_at,
                u.name as user_name,
                u.nickname as user_nickname
            FROM product_reviews pr
            JOIN users u ON pr.user_id = u.id
            WHERE pr.product_id = ?
            ORDER BY pr.created_at DESC
        `
        )
        .all(productId);

    console.log('Raw database rows:', rows);

    return rows.map((row: any) => {
        console.log('Processing row:', row);

        return {
            id: row.id,
            user_id: row.user_id,
            rating: row.rating,
            comment: row.comment,
            created_at: row.created_at,
            user: {
                name: row.user_name || '',
                nickname: row.user_nickname || ''
            }
        };
    });
}

export async function addProductReview(
    productId: number,
    userId: number,
    rating: number,
    comment: string
): Promise<void> {
    db.prepare(
        `
        INSERT INTO product_reviews (product_id, user_id, rating, comment)
        VALUES (?, ?, ?, ?)
    `
    ).run(productId, userId, rating, comment);
}

export async function updateProductReview(
    reviewId: number,
    rating: number,
    comment: string
): Promise<void> {
    db.prepare(
        `
        UPDATE product_reviews
        SET rating = ?, comment = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `
    ).run(rating, comment, reviewId);
}

export async function deleteProductReview(reviewId: number): Promise<void> {
    db.prepare('DELETE FROM product_reviews WHERE id = ?').run(reviewId);
}
