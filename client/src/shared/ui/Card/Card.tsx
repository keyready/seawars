import { cn } from '@heroui/react';

import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export const Card = ({ children, className, ...rest }: CardProps) => {
    return (
        <div
            {...rest}
            className={cn(
                'h-full w-full',
                'rounded-md bg-gradient-to-br from-indigo-800 to-blue-800 px-5 py-5',
                'shadow-2xl',
                className,
            )}
        >
            {children}
        </div>
    );
};
