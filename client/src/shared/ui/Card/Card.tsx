import { cn } from '@heroui/react';

import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    title?: string;
}

export const Card = ({ children, title, className, ...rest }: CardProps) => {
    return (
        <div
            {...rest}
            className={cn(
                className,
                'h-full w-full',
                'rounded-md bg-gradient-to-br from-indigo-800 to-blue-800 px-5 py-5',
                'shadow-2xl',
            )}
        >
            {title && <h2 className="mb-4 font-cs-font text-4xl">{title}</h2>}
            {children}
        </div>
    );
};
