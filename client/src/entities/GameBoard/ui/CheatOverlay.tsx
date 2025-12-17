import { AnimatePresence, motion } from 'framer-motion';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import type { Cell } from '@/entities/Ship';

import { getEnemyFleet } from '../model/selectors/getGameBoard';

export const CheatOverlay = ({ onFire }: { onFire: (c: number, r: number) => void }) => {
    const enemyFleet = useSelector(getEnemyFleet);

    const handleClick = useCallback(
        (ev: React.MouseEvent, cell: Cell) => {
            ev.stopPropagation();
            onFire(cell.r, cell.c);
        },
        [onFire],
    );

    if (!enemyFleet) {
        return null;
    }

    return (
        <AnimatePresence mode="sync">
            {enemyFleet.map((ship) =>
                ship.cells.map((cell) => (
                    <motion.div
                        onClick={(ev) => handleClick(ev, cell)}
                        key={'cheat-' + cell.r + '-' + cell.c}
                        initial={{ opacity: 0, scale: 0.6, borderRadius: '50%' }}
                        exit={{ opacity: 0, scale: 0.6, borderRadius: '50%' }}
                        animate={{ opacity: 1, scale: 1, borderRadius: 0 }}
                        transition={{ duration: 0.1 }}
                        className="absolute z-40 h-10 w-10 bg-warning-300/70"
                        style={{ top: cell.c * 40, left: cell.r * 40 }}
                    />
                )),
            )}
        </AnimatePresence>
    );
};
