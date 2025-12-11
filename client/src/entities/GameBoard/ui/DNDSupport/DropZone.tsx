import { useDroppable } from '@dnd-kit/core';

interface DropZoneProps {
    id: string;
    children: React.ReactNode;
    isOver?: boolean;
    className?: string;
}

export const DropZone = ({ id, children, className = '' }: DropZoneProps) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`relative h-[400px] w-[400px] rounded-md border-2 ${className}`}
            style={{
                background: `
                    linear-gradient(to right, #bbb 1px, transparent 1px),
                    linear-gradient(to bottom, #bbb 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
            }}
        >
            {children}
        </div>
    );
};
