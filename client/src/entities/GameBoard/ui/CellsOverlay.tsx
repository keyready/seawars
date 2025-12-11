import { cn } from '@heroui/react';

import { AnimatePresence, motion } from 'framer-motion';
import { useSelector } from 'react-redux';

import type { Cell } from '@/entities/Ship';

import { getCurrentTurn } from '../model/selectors/getGameBoard';

interface CellsOverlayProps {
    missCells: Cell[];
    hitCells: Cell[];
    hoveredCell?: Cell | undefined;
    prefix: string;
    isReady: boolean;
}

export const CellsOverlay = (props: CellsOverlayProps) => {
    const { missCells, hitCells, hoveredCell, isReady, prefix } = props;
    const playerTurn = useSelector(getCurrentTurn) === 'me';

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
            {playerTurn &&
                hoveredCell &&
                !hitCells.some((hc) => hc.c === hoveredCell.c && hc.r === hoveredCell.r) &&
                !missCells.some((hc) => hc.c === hoveredCell.c && hc.r === hoveredCell.r) && (
                    <motion.div
                        key={prefix + '-hover-' + hoveredCell.r + '-' + hoveredCell.c}
                        initial={{ opacity: 0, scale: 0.6, borderRadius: '50%' }}
                        exit={{ opacity: 0, scale: 0.6, borderRadius: '50%' }}
                        animate={{ opacity: 1, scale: 1, borderRadius: 0 }}
                        transition={{ duration: 0.1 }}
                        className={cn(
                            'pointer-events-none absolute z-50 h-10 w-10',
                            isReady ? 'bg-blue-500/70' : 'bg-gray-500/70',
                        )}
                        style={{
                            top: hoveredCell.r * 40,
                            left: hoveredCell.c * 40,
                        }}
                    />
                )}
        </AnimatePresence>
    );
};
