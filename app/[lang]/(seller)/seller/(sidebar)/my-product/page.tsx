import { verifyAuth } from '@/lib/auth';
import { getProductsByUserId, Product } from '@/lib/product';
import { MyProductPage } from './components/MyProductPage';

// Server Component
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
    const { user } = await verifyAuth();

    if (!user) {
        return <div>請先登入</div>;
    }

    const products = getProductsByUserId(Number(user.id));
    return <MyProductPage products={products} />;
}
