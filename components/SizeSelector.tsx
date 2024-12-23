interface SizeSelectorProps {
    sizes: string[];
    selected: string;
    onChange: (size: string) => void;
}

export function SizeSelector({ sizes, selected, onChange }: SizeSelectorProps) {
    return (
        <div className='flex flex-wrap gap-2'>
            {sizes.map((size) => (
                <button
                    key={size}
                    className={`
                        px-4 py-2 
                        border rounded 
                        transition-colors
                        ${
                            selected === size
                                ? 'border-orange bg-orange/10 text-orange'
                                : 'border-gray-300 hover:border-gray-400'
                        }
                    `}
                    onClick={() => onChange(size)}
                >
                    {size}
                </button>
            ))}
        </div>
    );
}
