import { Product } from '@/lib/product';

// 購物車商品類型
interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    variation?: {
        color?: string;
        size?: string;
    };
}

// 加入購物車函數
const addToCart = (
    product: Product,
    quantity: number,
    variation?: { color?: string; size?: string }
) => {
    // 從 localStorage 獲取現有購物車
    const existingCart = localStorage.getItem('cart');
    const cart = existingCart ? JSON.parse(existingCart) : [];

    // 檢查是否已存在相同商品和規格
    const existingItemIndex = cart.findIndex(
        (item: CartItem) =>
            item.id === product.id &&
            JSON.stringify(item.variation) === JSON.stringify(variation)
    );

    if (existingItemIndex > -1) {
        // 更新數量
        cart[existingItemIndex].quantity += quantity;
    } else {
        // 添加新商品
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,

            variation
        });
    }

    // 保存到 localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
};
