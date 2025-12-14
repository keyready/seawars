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
                'h-screen w-full font-sans text-white selection:bg-cyan-500 selection:text-white',
                'flex flex-col items-center justify-start gap-10 overflow-y-auto p-16 px-10',
                'bg-gradient-to-r from-gradStart to-gradEnd font-cs-font',
                className,
            )}
        >
            {children}
        </section>
    );
};
