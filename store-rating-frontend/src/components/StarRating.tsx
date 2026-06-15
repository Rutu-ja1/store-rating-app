// src/components/StarRating.tsx
import { useState } from 'react';

interface Props {
    value: number;
    onChange?: (v: number) => void;
    readonly?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ value, onChange, readonly, size = 'md' }: Props) {
    const [hover, setHover] = useState(0);

    const sizes = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' };

    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => !readonly && onChange?.(star)}
                    onMouseEnter={() => !readonly && setHover(star)}
                    onMouseLeave={() => !readonly && setHover(0)}
                    className={`${sizes[size]} transition-all duration-100 leading-none
            ${star <= (hover || value)
                            ? hover
                                ? 'text-amber-400 scale-110'
                                : 'text-amber-400'
                            : 'text-gray-200'
                        }
            ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
                >
                    ★
                </button>
            ))}
        </div>
    );
}