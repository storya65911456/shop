import { Dictionary } from '@/lib/dictionaries';
import { updateUser, UserData } from '@/lib/user';
import { useActionState } from 'react';
import { updateUserAction } from '@/lib/actions/user';

interface DetailEditorProps {
    dict: Dictionary;
    user: UserData | null;
}

export const DetailEditor = ({ dict, user }: DetailEditorProps) => {
    const [state, formAction] = useActionState(,{})
    return (
        <form className='w-[70%] h-full pl-2'>
            <ul className='flex-col gap-4 w-full h-full'>
                <li className='w-full h-[15%] flex items-center justify-start'>
                    {user?.name}
                </li>
                <li className='w-full h-[15%] flex items-center justify-start'>
                    <input
                        className='w-[80%] h-[80%] border-2 border-gray-300/90 rounded-md p-1'
                        type='text'
                        placeholder={
                            dict.account.profile.fileListItems.nicknamePlaceholder
                        }
                    />
                </li>
                <li className='w-full h-[15%] flex items-center justify-start'>
                    {user?.email}
                </li>
                <li className='w-full h-[15%] flex items-center justify-start'>
                    <button className='w-[20%] h-[80%] bg-orange rounded shadow-sm shadow-gray-500/90 hover:bg-[#f53d2d] transition-all duration-300 disabled:opacity-50'></button>
                </li>
            </ul>
        </form>
    );
};
