import { cn } from '@heroui/react';

import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ChatPanel } from '@/entities/GameBoard/ui/ChatPanel';
import type { Cell } from '@/entities/Ship';

import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useGameActions } from '@/shared/hooks/useGameSocket';

import {
    getCurrentTurn,
    getEnemyGameboard,
    getHelpTools,
    getIsPlayerReady,
} from '../../model/selectors/getGameBoard';
import { GameboardActions } from '../../model/slice/GameBoardSlice';
import { CellsOverlay } from '../CellsOverlay';
import { CheatOverlay } from '../CheatOverlay';

function getLineCells(row: number): Cell[] {
    return Array.from({ length: 10 }, (_, c) => ({ r: row, c }));
}

function getBombArea(center: Cell): Cell[] {
    const area: Cell[] = [];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            const r = center.r + dr;
            const c = center.c + dc;
            if (r >= 0 && r < 10 && c >= 0 && c < 10) {
                area.push({ r, c });
            }
        }
    }
    return area;
}

export const EnemyBoard = () => {
    const { missCells, hitCells } = useSelector(getEnemyGameboard);

    const isReady = useSelector(getIsPlayerReady);
    const playerTurn = useSelector(getCurrentTurn) === 'me';
    const helpTools = useSelector(getHelpTools);

    const dispatch = useAppDispatch();
    const { fire, requestWeaknessSupport, requestBombDrop } = useGameActions();

    const [hoveredCell, setHoveredCell] = useState<Cell>();
    const [overlayAreas, setOverlayAreas] = useState<
        { cells: Cell[]; color: string; key: string }[]
    >([]);

    useEffect(() => {
        if (helpTools?.enabled === 'airplane' && helpTools?.hoveredRow !== undefined) {
            setOverlayAreas([
                {
                    cells: getLineCells(helpTools.hoveredRow),
                    color: 'bg-red-600/40',
                    key: 'airplane',
                },
            ]);
        } else if (helpTools?.enabled === 'bomb' && hoveredCell) {
            setOverlayAreas([
                { cells: getBombArea(hoveredCell), color: 'bg-rose-600/40', key: 'bomb' },
            ]);
        } else if (hoveredCell) {
            setOverlayAreas([{ cells: [hoveredCell], color: 'bg-blue-600/80', key: 'bomb' }]);
        } else {
            setOverlayAreas([{ cells: [], color: 'bg-blue-600/80', key: 'bomb' }]);
        }
    }, [helpTools?.enabled, helpTools?.hoveredRow, hoveredCell]);

    const handleEnemyBoardFire = useCallback(
        (ev: React.MouseEvent) => {
            if (!playerTurn) return;
            if (helpTools?.enabled === 'airplane' && helpTools?.hoveredRow !== undefined) {
                requestWeaknessSupport(helpTools.hoveredRow);
                dispatch(
                    GameboardActions.setHelpTools({
                        enabled: undefined,
                        hoveredRow: undefined,
                    }),
                );
                return;
            }
            if (helpTools?.enabled === 'bomb') {
                const bombCenter = {
                    c: Math.max(0, Math.min(9, Math.round((ev.nativeEvent.layerX - 20) / 40))),
                    r: Math.max(0, Math.min(9, Math.round((ev.nativeEvent.layerY - 20) / 40))),
                };
                requestBombDrop(bombCenter);
                dispatch(GameboardActions.setHelpTools({ enabled: undefined }));
                return;
            }
            const hit = {
                c: Math.max(0, Math.min(9, Math.round((ev.nativeEvent.layerX - 20) / 40))),
                r: Math.max(0, Math.min(9, Math.round((ev.nativeEvent.layerY - 20) / 40))),
            };
            fire(hit);
        },
        [
            dispatch,
            fire,
            helpTools?.enabled,
            helpTools?.hoveredRow,
            playerTurn,
            requestBombDrop,
            requestWeaknessSupport,
        ],
    );

    const handleCheatFire = useCallback(
        (c: number, r: number) => {
            fire({ c, r });
        },
        [fire],
    );

    const handleEnemyBoardMove = useCallback(
        (ev: React.MouseEvent) => {
            const rect = ev.currentTarget.getBoundingClientRect();
            const x = ev.clientX - rect.left;
            const y = ev.clientY - rect.top;

            if (x < 0 || y < 0 || x >= 400 || y >= 400) {
                setHoveredCell(undefined);
                return;
            }

            const hit = {
                c: Math.max(0, Math.min(9, Math.round((ev.nativeEvent.layerX - 20) / 40))),
                r: Math.max(0, Math.min(9, Math.round((ev.nativeEvent.layerY - 20) / 40))),
            };

            if (hit.c < 0 || hit.c > 9 || hit.r < 0 || hit.r > 9) {
                setHoveredCell(undefined);
                return;
            }

            setHoveredCell(hit);
            if (helpTools?.enabled === 'airplane') {
                dispatch(
                    GameboardActions.setHelpTools({
                        ...helpTools,
                        hoveredRow: Math.floor(y / 40),
                    }),
                );
            }
        },
        [dispatch, helpTools],
    );

    const handleMouseOut = useCallback(() => {
        setHoveredCell(undefined);
        dispatch(
            GameboardActions.setHelpTools({
                ...helpTools,
                hoveredRow: undefined,
            }),
        );
    }, [dispatch, helpTools]);

    return (
        <div
            onClick={handleEnemyBoardFire}
            onMouseMove={handleEnemyBoardMove}
            onMouseOut={handleMouseOut}
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
            <CheatOverlay onFire={handleCheatFire} />
            <ChatPanel />
            <CellsOverlay
                prefix="enemy"
                missCells={missCells}
                hitCells={hitCells}
                isReady={isReady}
                overlayAreas={overlayAreas}
            />
        </div>
    );
};
