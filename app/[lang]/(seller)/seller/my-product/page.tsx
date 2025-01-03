export default async ({
    params
}: {
    params: Promise<{
        lang: string;
    }>;
}) => {
    const { lang } = await params;

    return <div className=' bg-gray-100/20'>my-product</div>;
};
