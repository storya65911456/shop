import db from '@/db/db';

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    seller_type: 'company' | 'user';
    seller_id?: number;
    created_at: string;
    updated_at: string;
}

// 獲取所有商品
export function getAllProducts(): Product[] {
    return db.prepare('SELECT * FROM products').all() as Product[];
}

// 獲取單個商品
export function getProductById(id: number): Product | undefined {
    return db.prepare('SELECT * FROM products WHERE id = ?').get(id) as
        | Product
        | undefined;
}
