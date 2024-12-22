import { getProductById } from '@/lib/product';

export default async ({ params }: { params: { slug: string } }) => {
    const product = getProductById(parseInt(params.slug));
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
