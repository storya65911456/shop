import { getProductById } from '@/lib/product';

interface PageProps {
    params: Promise<{
        lang: string;
        slug: string;
    }>;
}

export default async ({ params }: PageProps) => {
    const { slug } = await params;

    const product = getProductById(parseInt(slug));
    if (!product) {
        return <div>Product not found</div>;
    }
    return (
        <>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
        </>
    );
};
