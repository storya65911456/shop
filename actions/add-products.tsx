'use server';

interface VariationStock {
    color: string;
    sizes: {
        size: string;
        stock: string;
    }[];
}

interface ActionState {
    error?: string;
    success?: boolean;
}

export const addProductActions = async (state: ActionState, formData: FormData) => {
    try {
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const categories = JSON.parse(formData.get('categories') as string);
        const price = formData.get('price') as string;
        const stock = formData.get('stock') as string;
        const variations = JSON.parse(formData.get('variations') as string);
        const variationStocks = formData.get('variationStocks')
            ? (JSON.parse(formData.get('variationStocks') as string) as VariationStock[])
            : null;

        // 基本驗證
        if (title.length < 5 || title.length > 100) {
            return { error: '商品名稱字數需介於 5~100 字之間' };
        }
        if (categories.length === 0) {
            return { error: '請選擇商品類別' };
        }
        if (description.length < 20) {
            return { error: '商品描述需填入至少 20 個文字' };
        }
        if (!price) {
            return { error: '請輸入商品價格' };
        }

        // 庫存驗證
        if (
            (!stock || isNaN(parseInt(stock)) || parseInt(stock) <= 0) &&
            variationStocks?.length === 0
        ) {
            return { error: '請設定有效的庫存數量' };
        }

        const submitData = {
            title,
            description,
            categories,
            price,
            stocks: variations.length > 0 ? variationStocks : stock
        };

        console.log('提交的資料：', submitData);
        return { success: true, error: undefined };
    } catch (error) {
        console.error('提交失敗：', error);
        return { error: '提交失敗，請稍後再試', success: undefined };
    }
};
