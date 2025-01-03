export default async ({
    params
}: {
    params: Promise<{
        lang: string;
    }>;
}) => {
    const { lang } = await params;

    return <div className='w-full h-full bg-white rounded-md p-6'>add-product</div>;
};
