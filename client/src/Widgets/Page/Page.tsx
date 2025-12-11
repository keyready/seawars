import { cn } from '@heroui/react';

import type { ReactNode } from 'react';

interface PageProps {
    children: ReactNode;
}

export const Page = ({ children }: PageProps) => {
    return (
        <section
            className={cn(
                'h-screen w-full bg-slate-900 font-sans text-white selection:bg-cyan-500 selection:text-white',
                'flex flex-col items-center justify-center gap-10',
            )}
        >
            {children}
        </section>
    );
};
