interface RatingStarsProps {
    rating: number;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function RatingStars({ rating, size = 'md' }: RatingStarsProps) {
    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-2xl'
    };

    return (
        <div className={`flex text-orange ${sizeClasses[size]}`}>
            {[5, 4, 3, 2, 1].map((index) => {
                const starValue = 6 - index;
                const diff = rating - starValue;

                return (
                    <span key={index} className='inline-block'>
                        {diff >= 0 ? '★' : diff > -0.5 ? '⭐' : '☆'}
                    </span>
                );
            })}
        </div>
    );
}
