'use client';

import { useState } from 'react';
import { FaFacebookMessenger, FaLine, FaTelegram } from 'react-icons/fa';
import { FaHeadset } from 'react-icons/fa6';

export const ContactMenu = () => {
    const [isOpen, setIsOpen] = useState(false); // 控制選單的開關
    const [rotateDegree, setRotateDegree] = useState(0); // 控制按鈕旋轉角度

    // 切換選單開關
    const toggleMenu = () => {
        if (isOpen) {
            setRotateDegree(rotateDegree - 360); // 關閉時逆時針旋轉
        } else {
            setRotateDegree(rotateDegree + 360); // 打開時順時針旋轉
        }
        setIsOpen(!isOpen); // 切換開關狀態
    };

    return (
        <div className='fixed right-4 bottom-4 flex flex-col items-center'>
            {/* 圓形按鈕，根據 isOpen 狀態決定是否顯示並從同一位置展開 */}
            <div
                className={`flex flex-col items-center space-y-4 transition-all duration-300 ease-in-out ${
                    isOpen
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-12 pointer-events-none'
                }`}
            >
                <button className='shadow-[#f53d2d] bg-[#ee4d2d] w-12 h-12 rounded-full flex items-center justify-center shadow-md'>
                    <FaTelegram className='text-2xl' />
                </button>
                <button className='shadow-[#f53d2d] bg-[#ee4d2d] w-12 h-12 rounded-full flex items-center justify-center shadow-md'>
                    <FaFacebookMessenger className='text-2xl' />
                </button>
                <button className='shadow-[#f53d2d] bg-[#ee4d2d] w-12 h-12 rounded-full flex items-center justify-center shadow-md'>
                    <FaLine className='text-3xl' />
                </button>
            </div>

            {/* 主按鈕，根據 isOpen 狀態決定圖標變化並且添加旋轉動畫 */}
            <button
                className={`shadow-[#f53d2d] bg-[#ee4d2d] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md mt-4 transform transition-transform duration-300`}
                style={{ transform: `rotate(${rotateDegree}deg)` }} // 根據旋轉角度控制旋轉
                onClick={toggleMenu}
            >
                <span
                    className={`transform transition-transform duration-300 ease-in-out`}
                >
                    {isOpen ? '✖' : <FaHeadset />}
                </span>
            </button>
        </div>
    );
};
