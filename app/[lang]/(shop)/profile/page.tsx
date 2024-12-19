import { CgProfile } from 'react-icons/cg';
export default () => {
    return (
        <div className='h-[600px] w-[1280px] mx-auto overflow-auto whitespace-nowrap flex flex-row gap-2'>
            {/* 目錄 */}
            <div className='w-[180px] h-[500px] mt-6'>
                <div className='w-full h-[80px] p-2 flex items-center justify-center'>
                    <CgProfile className='text-6xl w-[30%]' />
                    <div className='w-[80%] text-center'>
                        <p>個人資料</p>
                    </div>
                </div>
                <div className='w-full h-[400px]'>目錄</div>
            </div>
            {/* 顯示區塊 */}
            <div className='w-full h-[500px] mt-6 pl-6'>
                <div className='w-full h-full bg-gray-100 rounded shadow-lg shadow-gray-500/90'>
                    <h1>Profile</h1>
                </div>
            </div>
        </div>
    );
};
