'use client';

import { useEffect, useState } from 'react';

// 定義 Slide 類型
interface Slide {
    id: number;
    imageUrl: string;
    altText: string;
}

// 定義 Carousel 組件的 props 類型
interface CarouselProps {
    slides: Slide[];
}

const Carousel = ({ slides }: CarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false); // 控制暫停狀態

    const totalSlides = slides.length;

    // 自動輪播效果
    useEffect(() => {
        if (isPaused) return; // 如果懸停，暫停自動播放

        const goToNextSlide = () => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
        };

        const interval = setInterval(() => {
            goToNextSlide();
        }, 3000); // 每3秒切換一次

        return () => clearInterval(interval);
    }, [currentIndex, isPaused, totalSlides]); // 添加 totalSlides 作為依賴，確保當 slides 改變時效果能重新執行

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const handleMouseEnter = () => {
        setIsPaused(true); // 懸停時暫停輪播
    };

    const handleMouseLeave = () => {
        setIsPaused(false); // 離開後恢復輪播
    };

    return (
        <div
            className='relative w-full mx-auto h-full rounded-md'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* 圖片 */}
            <div className='overflow-hidden relative h-full rounded-md'>
                <div
                    className='flex transition-transform duration-500 ease-in-out h-full'
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {slides.map((slide) => (
                        <div key={slide.id} className='min-w-full h-full'>
                            <img
                                src={slide.imageUrl}
                                alt={slide.altText}
                                className='w-full h-full object-cover'
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* 圖片指示點 */}
            <div className='absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-3'>
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={`cursor-pointer transition-all duration-300 ${
                            currentIndex === index
                                ? 'w-8 h-2 bg-slate-200 rounded-lg' // 當前點變為長條形
                                : 'w-2 h-2 bg-gray-300 rounded-full' // 其他點保持圓形
                        }`}
                        onClick={() => goToSlide(index)} // 點擊切換圖片
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
