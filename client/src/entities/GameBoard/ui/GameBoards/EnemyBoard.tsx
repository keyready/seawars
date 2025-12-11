import { cn } from '@heroui/react';

import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import type { Cell } from '@/entities/Ship';

import { useGameActions } from '@/shared/hooks/useGameSocket';

import {
    getCurrentTurn,
    getEnemyGameboard,
    getIsPlayerReady,
} from '../../model/selectors/getGameBoard';
import { CellsOverlay } from '../CellsOverlay';

export const EnemyBoard = () => {
    const { missCells, hitCells } = useSelector(getEnemyGameboard);

    const isReady = useSelector(getIsPlayerReady);
    const playerTurn = useSelector(getCurrentTurn) === 'me';

    const { fire } = useGameActions();

    const [hoveredCell, setHoveredCell] = useState<Cell>();

    const handleEnemyBoardFire = useCallback(
        (ev: React.MouseEvent) => {
            if (!playerTurn) return;
            const hit = {
                c: Math.max(0, Math.min(9, Math.round((ev.nativeEvent.layerX - 20) / 40))),
                r: Math.max(0, Math.min(9, Math.round((ev.nativeEvent.layerY - 20) / 40))),
            };
            fire(hit);
        },
        [fire, playerTurn],
    );

    const handleEnemyBoardMove = useCallback((ev: React.MouseEvent) => {
        const rect = ev.currentTarget.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;

        if (x < 0 || y < 0 || x >= 400 || y >= 400) {
            setHoveredCell(undefined);
            return;
        }

        const hit = {
            c: Math.floor(x / 40),
            r: Math.floor(y / 40),
        };

        if (hit.c < 0 || hit.c > 9 || hit.r < 0 || hit.r > 9) {
            setHoveredCell(undefined);
            return;
        }

        setHoveredCell(hit);
    }, []);

    return (
        <div
            onClick={handleEnemyBoardFire}
            onMouseMove={handleEnemyBoardMove}
            onMouseOut={() => setHoveredCell(undefined)}
            className={cn(
                'relative h-[400px] w-[400px] rounded-md border-2',
                isReady && playerTurn ? 'cursor-pointer' : 'cursor-not-allowed',
            )}
            style={{
                background: `
                    linear-gradient(to right, #bbb 1px, transparent 1px),
                    linear-gradient(to bottom, #bbb 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
            }}
        >
            <CellsOverlay
                prefix="enemy"
                missCells={missCells}
                hitCells={hitCells}
                hoveredCell={hoveredCell}
                isReady={isReady}
            />
        </div>
    );
};
