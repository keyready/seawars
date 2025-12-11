import { DndContext, type DragEndEvent } from '@dnd-kit/core';

import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useGameActions } from '@/shared/hooks/useGameSocket';

import { updateShip } from '../model/lib/updateShip';
import { getOwnerFleet } from '../model/selectors/getGameBoard';
import { GameboardActions } from '../model/slice/GameBoardSlice';

import { EnemyBoard } from './GameBoards/EnemyBoard';
import { OwnerBoard } from './GameBoards/OwnerBoard';

interface DroppableShipBoardProps {
    type: 'own' | 'enemy';
}

export const DroppableShipBoard = ({ type }: DroppableShipBoardProps) => {
    const fleet = useSelector(getOwnerFleet);
    const dispatch = useAppDispatch();

    const { startGame } = useGameActions();

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, delta } = event;
            if (!delta) return;

            const shipId = active.id as string;

            const ship = fleet.find((s) => s.id === shipId);
            if (!ship) return;

            const dCellX = Math.round(delta.x / 40);
            const dCellY = Math.round(delta.y / 40);

            const newHead = {
                r: ship.head.r + dCellX,
                c: ship.head.c + dCellY,
            };
            dispatch(GameboardActions.setOwnerFleet(updateShip(shipId, fleet, { head: newHead })));
        },
        [dispatch, fleet],
    );

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="relative">
                <div
                    className="absolute top-0 left-0 h-[400px] w-[400px] opacity-70"
                    style={{
                        background: 'url(/backgrounds/seawaves.webp)',
                        backgroundPosition: 'center',
                        backgroundSize: '100% 100%',
                        backgroundRepeat: 'no-repeat',
                    }}
                />
                {type === 'own' ? <OwnerBoard onPlacementEnd={startGame} /> : <EnemyBoard />}
            </div>
        </DndContext>
    );
};
