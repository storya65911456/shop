export const Footer = () => {
    return (
        <footer className='bg-[#2C2C2C]'>
            <div className='w-[1280px] mx-auto px-4 pt-10 overflow-auto whitespace-nowrap flex'>
                {/* 客服中心 */}
                <div className='w-[250px]'>
                    <h3 className='font-semibold mb-4'>客服中心</h3>
                    <ul className='space-y-2 text-sm flex flex-col gap-1'>
                        <li>幫助中心</li>
                        <li>蝦皮商家</li>
                        <li>付款方式</li>
                        <li>蝦皮錢包</li>
                        <li>運費補助</li>
                        <li>退貨退款</li>
                    </ul>
                </div>

                {/* 關於蝦皮 */}
                <div className='w-[250px]'>
                    <h3 className='font-semibold mb-4'>關於蝦皮</h3>
                    <ul className='space-y-2 text-sm flex flex-col gap-1'>
                        <li>購買蝦皮</li>
                        <li>加入我們</li>
                        <li>隱私權政策</li>
                        <li>蝦皮條款</li>
                        <li>蝦皮商城</li>
                        <li>聯絡媒體</li>
                    </ul>
                </div>

                {/* 支付與物流 */}
                <div className='w-[250px]'>
                    <h3 className='font-semibold mb-4'>付款與物流</h3>
                    <div className='flex space-x-2 mb-4'></div>
                    <h3 className='font-semibold mb-4'>物流合作</h3>
                    <div className='flex flex-wrap gap-2'></div>
                </div>

                {/* 關注我們 */}
                <div className='w-[250px]'>
                    <h3 className='font-semibold mb-4'>關注我們</h3>
                    <ul className='space-y-2 text-sm flex flex-col gap-1'>
                        <li>Facebook</li>
                        <li>Instagram</li>
                        <li>Line</li>
                        <li>LinkedIn</li>
                    </ul>
                </div>
                {/* 下載 */}
                <div className='w-[250px]'>
                    <h3 className='font-semibold mb-4 mt-4'>下載蝦皮</h3>
                    <div className='flex space-x-2'></div>
                </div>
            </div>
            <div className='text-center text-sm mt-8 border-t pt-4'>
                © 2024 XXXX. 版權所有。
            </div>
        </footer>
    );
};
