import { cn } from '@heroui/react';

import type { ReactNode } from 'react';

interface PageProps {
    children: ReactNode;
    className?: string;
}

export const Page = ({ children, className }: PageProps) => {
    return (
        <section
            className={cn(
                'min-h-screen w-full font-sans text-white selection:bg-cyan-500 selection:text-white',
                'flex flex-col items-center justify-start gap-10 overflow-y-auto px-10 py-12',
                'font-nunito-font bg-gradient-to-r from-gradStart to-gradEnd',
                className,
            )}
        >
            {children}
        </section>
    );
};
