'use client';
import { updateNicknameAction } from '@/actions/derail-from';
import { Dictionary } from '@/lib/dictionaries';
import { UserData } from '@/lib/user';
import { useActionState, useCallback, useEffect } from 'react';

interface DetailEditorProps {
    dict: Dictionary;
    user: UserData | null;
}

export const DetailEditor = ({ dict, user }: DetailEditorProps) => {
    const [state, formAction] = useActionState(updateNicknameAction, {});

    const showAlert = useCallback((message: string) => {
        alert(message);
    }, []);

    useEffect(() => {
        if (state.error) {
            showAlert(state.error);
        }
        if (state.success) {
            showAlert(dict.account.profile.fileListItems.updateSuccess);
        }
    }, [state, showAlert]);

    return (
        <form action={formAction} className='w-[70%] h-full pl-2'>
            <ul className='flex-col gap-4 w-full h-full'>
                <li className='w-full h-[15%] flex items-center justify-start'>
                    {user?.name}
                </li>
                <li className='w-full h-[15%] flex items-center justify-start'>
                    <input
                        name='nickname'
                        className='w-[80%] h-[80%] border-2 border-gray-300/90 rounded-md p-1'
                        type='text'
                        defaultValue={user?.nickname || ''}
                        placeholder={
                            dict.account.profile.fileListItems.nicknamePlaceholder
                        }
                    />
                </li>
                <li className='w-full h-[15%] flex items-center justify-start'>
                    {user?.email}
                </li>
                <li className='w-full h-[15%] flex items-center justify-start'>
                    <button
                        type='submit'
                        className='w-[20%] h-[80%] bg-orange rounded shadow-sm shadow-gray-500/90 hover:bg-[#f53d2d] transition-all duration-300 disabled:opacity-50'
                    >
                        {dict.account.profile.button.save}
                    </button>
                </li>
            </ul>
        </form>
    );
};
