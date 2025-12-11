import { useDraggable } from '@dnd-kit/core';
import { cn } from '@heroui/react';

import { type CSSProperties, useMemo } from 'react';

import type { Cell } from '@/entities/Ship';

interface DraggableElementProps {
    id: string;
    initialPosition?: { x: number; y: number };
    src: string;
    direction: 'hor' | 'vert';
    onDirectionChange: (id: string) => void;
    hitCellCoords?: Cell;
}

export const DraggableShip = (props: DraggableElementProps) => {
    const {
        id,
        initialPosition = { x: 0, y: 0 },
        src,
        direction,
        onDirectionChange,
        hitCellCoords,
    } = props;

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

    const [cols, rows] = useMemo(() => {
        const match = src.match(/(\d+)x(\d+)/);
        if (!match) return [1, 1];
        return [parseInt(match[1], 10), parseInt(match[2], 10)];
    }, [src]);

    const width = cols * 40;
    const height = rows * 40;

    const rotateAdjustment =
        direction === 'vert'
            ? `translate(${(height - width) / 2}px, ${(width - height) / 2}px)`
            : '';

    const combinedTransform = [
        transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : '',
        rotateAdjustment,
        `rotate(${direction === 'hor' ? '0' : '90'}deg)`,
    ]
        .filter(Boolean)
        .join(' ');

    const style: CSSProperties = {
        position: 'absolute',
        top: initialPosition.y,
        left: initialPosition.x,
        width,
        height,
        transform: combinedTransform,
        transformOrigin: 'center', // 👍 правильно
        touchAction: 'none',
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 100 : 1,
        cursor: 'grab',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn('rounded-md')}
            {...listeners}
            {...attributes}
            onDoubleClick={(e) => {
                e.stopPropagation(); // предотвращаем drag-активацию при dblclick
                onDirectionChange(id);
            }}
        >
            <img src={'/ships/' + src} alt="ship" />
            {hitCellCoords && (
                <div
                    style={{
                        top: initialPosition.y - hitCellCoords.c + 'px',
                        left: initialPosition.x - hitCellCoords.r + 'px',
                    }}
                    className="absolute z-50 h-[40px] w-[40px] rounded-md bg-red-500/80"
                />
            )}
        </div>
    );
};
