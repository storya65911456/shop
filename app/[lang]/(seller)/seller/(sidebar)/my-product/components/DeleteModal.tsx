// 確認對話框組件
export const DeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    productName
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    productName: string;
}) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4'>
                <h3 className='text-xl font-bold mb-4'>確認刪除</h3>
                <p className='text-gray-300 mb-6'>
                    確定要刪除商品「{productName}」嗎？此操作無法復原。
                </p>
                <div className='flex justify-end gap-4'>
                    <button
                        onClick={onClose}
                        className='px-4 py-2 text-gray-400 hover:text-white'
                    >
                        取消
                    </button>
                    <button
                        onClick={onConfirm}
                        className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
                    >
                        確認刪除
                    </button>
                </div>
            </div>
        </div>
    );
};
