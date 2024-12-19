import { verifyAuth } from '@/lib/auth';
import { getDictionary } from '@/lib/dictionaries';
import { CgProfile } from 'react-icons/cg';

export default async ({
    params
}: {
    params: Promise<{
        lang: string;
    }>;
}) => {
    const { user } = await verifyAuth();
    const { lang } = await params;
    const dict = await getDictionary(lang as 'en' | 'zh-TW');

    return (
        <div className='h-[600px] w-[1280px] mx-auto overflow-auto whitespace-nowrap flex flex-row gap-2'>
            {/* 顯示區塊 */}
            <div className='w-full h-[500px] mt-6 pl-6 text-black'>
                <div className='w-full h-full bg-gray-100 rounded shadow-md shadow-gray-500/90'>
                    <div className='w-full h-[100px] p-6 flex-col items-start justify-center'>
                        <p className='text-2xl font-bold my-1'>
                            {dict.account.profile.title}
                        </p>
                        <p className='text-sm mb-2'>
                            {dict.account.profile.fileListDescription}
                        </p>
                        {/* 分隔線 */}
                        <div className='border-b-2 border-gray-300/90 w-full'></div>
                    </div>
                    <div className='w-full h-[400px] flex items-center justify-center p-6'>
                        <div className='w-[70%] h-full flex flex-row items-start justify-center'>
                            {/* 標題 */}
                            <div className='w-[30%] h-full pr-2'>
                                <ul className='flex-col gap-4 w-full h-full'>
                                    <li className='w-full h-[15%] flex items-center justify-end'>
                                        {dict.account.profile.fileListItems.username}
                                    </li>
                                    <li className='w-full h-[15%] flex items-center justify-end'>
                                        {dict.account.profile.fileListItems.nickname}
                                    </li>
                                    <li className='w-full h-[15%] flex items-center justify-end'>
                                        {dict.account.profile.fileListItems.email}
                                    </li>
                                </ul>
                            </div>
                            {/* 資訊 */}
                            <div className='w-[70%] h-full pl-2'>
                                <ul className='flex-col gap-4 w-full h-full'>
                                    <li className='w-full h-[15%] flex items-center justify-start'>
                                        {user?.name}
                                    </li>
                                    <li className='w-full h-[15%] flex items-center justify-start'>
                                        <input
                                            className='w-[80%] h-[80%] border-2 border-gray-300/90 rounded-md p-1'
                                            type='text'
                                        />
                                    </li>
                                    <li className='w-full h-[15%] flex items-center justify-start'>
                                        {user?.email}
                                    </li>
                                    <li className='w-full h-[15%] flex items-center justify-start'>
                                        <button className='w-[20%] h-[80%] bg-orange rounded shadow-sm shadow-gray-500/90 hover:bg-[#f53d2d] transition-all duration-300'>
                                            {dict.account.profile.button.save}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* 頭像 */}
                        <div className='w-[30%] h-full'>
                            <div className='w-full h-[60%] border-l-2 border-gray-300/90 flex-row items-center justify-center'>
                                <CgProfile className='text-8xl w-[30%] mx-auto mb-2' />
                                <button className='w-[40%] h-[20%] bg-gray-300/90 rounded-md flex items-center justify-center mx-auto'>
                                    {dict.account.profile.button.select}
                                </button>
                                <p className='text-sm text-center text-gray-500/90 mt-2'>
                                    {dict.account.profile.fileListItemsPicture.text1}
                                </p>
                                <p className='text-sm text-center text-gray-500/90'>
                                    {dict.account.profile.fileListItemsPicture.text2}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
