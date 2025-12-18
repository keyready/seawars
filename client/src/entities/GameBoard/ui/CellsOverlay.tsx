import { cn } from '@heroui/react';

import { AnimatePresence, motion } from 'framer-motion';

import type { Cell } from '@/entities/Ship';

interface OverlayArea {
    cells: Cell[];
    color: string;
    key: string;
}

interface CellsOverlayProps {
    missCells: Cell[];
    hitCells: Cell[];
    overlayAreas?: OverlayArea[];
    prefix: string;
    isReady: boolean;
}

export const CellsOverlay = (props: CellsOverlayProps) => {
    const { missCells, hitCells, overlayAreas = [], isReady, prefix } = props;

    return (
        <AnimatePresence mode="sync">
            {hitCells.map((cell) => (
                <motion.div
                    key={prefix + '-hit-' + cell.r + '-' + cell.c}
                    initial={{ opacity: 0, scale: 0.6, borderRadius: '50%' }}
                    exit={{ opacity: 0, scale: 0.6, borderRadius: '50%' }}
                    animate={{ opacity: 1, scale: 1, borderRadius: 0 }}
                    transition={{ duration: 0.1 }}
                    className="absolute z-50 h-10 w-10 bg-red-300/70"
                    style={{ top: cell.r * 40, left: cell.c * 40 }}
                />
            ))}
            {missCells.map((cell) => (
                <motion.div
                    key={prefix + '-miss-' + cell.r + '-' + cell.c}
                    initial={{ opacity: 0, scale: 0.6, borderRadius: '50%' }}
                    exit={{ opacity: 0, scale: 0.6, borderRadius: '50%' }}
                    animate={{ opacity: 1, scale: 1, borderRadius: 0 }}
                    transition={{ duration: 0.1 }}
                    className="absolute z-50 h-10 w-10 bg-gray-300/70"
                    style={{ top: cell.r * 40, left: cell.c * 40 }}
                />
            ))}
            {overlayAreas.map((area) =>
                area.cells.map((cell) => (
                    <motion.div
                        key={prefix + '-' + area.key + '-' + cell.r + '-' + cell.c}
                        initial={{ opacity: 0, scale: 0.6, borderRadius: '50%' }}
                        exit={{ opacity: 0, scale: 0.6, borderRadius: '50%' }}
                        animate={{ opacity: 1, scale: 1, borderRadius: 0 }}
                        transition={{ duration: 0.1 }}
                        className={cn(
                            'pointer-events-none absolute z-50 h-10 w-10',
                            area.color || (isReady ? 'bg-blue-500/70' : 'bg-gray-500/70'),
                        )}
                        style={{
                            top: cell.r * 40,
                            left: cell.c * 40,
                        }}
                    />
                )),
            )}
        </AnimatePresence>
    );
};
