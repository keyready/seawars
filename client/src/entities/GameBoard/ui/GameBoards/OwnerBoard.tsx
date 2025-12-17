import { addToast, Alert, Button } from '@heroui/react';

import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { ShipOrientation } from '@/entities/Ship';

import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useMultiKeyCombo } from '@/shared/hooks/useCheatKeys';
import { useGameActions } from '@/shared/hooks/useGameSocket';

import { generateRandomFleet } from '../../model/lib/generateFleet';
import { updateShip } from '../../model/lib/updateShip';
import {
    getCurrentTurn,
    getGamePhase,
    getIsPlayerReady,
    getOwnerFleet,
    getOwnerGameboard,
} from '../../model/selectors/getGameBoard';
import { GameboardActions } from '../../model/slice/GameBoardSlice';
import { CellsOverlay } from '../CellsOverlay';
import { DraggableShip } from '../DNDSupport/DraggableShip';
import { DropZone } from '../DNDSupport/DropZone';

const DROPPABLE_ID = 'dropzone-main';
const CELL_SIZE = 40;
const SHIP_IMAGES: Record<number, string> = {
    1: '1x1.webp',
    2: '2x1.webp',
    3: '3x1.webp',
    4: '4x1.webp',
};

interface OwnerBoardProps {
    onPlacementEnd: () => void;
}

export const OwnerBoard = ({ onPlacementEnd }: OwnerBoardProps) => {
    const dispatch = useAppDispatch();

    const { missCells, hitCells } = useSelector(getOwnerGameboard);
    const fleet = useSelector(getOwnerFleet);
    const isBattleStarted = useSelector(getGamePhase) === 'battle';
    const isPlayersTurn = useSelector(getCurrentTurn) === 'me';
    const isReady = useSelector(getIsPlayerReady);

    const { getHelp } = useGameActions();

    useMultiKeyCombo(['ShiftLeft', 'KeyC', 'KeyH', 'KeyE', 'KeyA', 'KeyT'], () => {
        addToast({ title: 'Запрашиваю подкрепление...' });
        getHelp();
    });

    const generateFleet = useCallback(() => {
        dispatch(GameboardActions.setOwnerFleet(generateRandomFleet()));
    }, [dispatch]);

    const handleDirectionChange = useCallback(
        (shipId: string) => {
            console.log('Попытка повернуть корбаль');
            dispatch(
                GameboardActions.setOwnerFleet(
                    updateShip(shipId, fleet, {
                        orientation:
                            fleet.find((s) => s.id === shipId)?.orientation ===
                            ShipOrientation.Horizontal
                                ? ShipOrientation.Vertical
                                : ShipOrientation.Horizontal,
                    }),
                ),
            );
        },
        [dispatch, fleet],
    );

    const renderReadyControls = useMemo(() => {
        return (
            <>
                <Button color="primary" onPress={generateFleet}>
                    Сгенерировать флот
                </Button>
                <Button
                    isDisabled={fleet.some((sh) => sh.head.r > 9 || sh.head.c > 9)}
                    color="success"
                    onPress={onPlacementEnd}
                >
                    К бою готов!
                </Button>
            </>
        );
    }, [fleet, generateFleet, onPlacementEnd]);

    const renderPlayerReadyAlerts = useMemo(() => {
        if (isBattleStarted && isPlayersTurn) {
            return (
                <Alert className="w-full" color="danger">
                    Бой начался | Ваш ход
                </Alert>
            );
        }

        if (isBattleStarted && !isPlayersTurn) {
            return (
                <Alert className="w-full" color="warning">
                    Бой начался | Ход противника
                </Alert>
            );
        }

        return (
            <Alert className="w-full" color="secondary">
                Ожидание противника
            </Alert>
        );
    }, [isBattleStarted, isPlayersTurn]);

    return (
        <div className="relative flex flex-col items-center justify-center gap-10">
            <DropZone id={DROPPABLE_ID} isOver={false}>
                {fleet.map((ship) => {
                    const displayX = ship.head.r < 0 ? -150 : ship.head.r * CELL_SIZE;
                    const displayY =
                        ship.head.c < 0 ? 30 + ship.id.charCodeAt(0) * 20 : ship.head.c * CELL_SIZE;

                    return (
                        <DraggableShip
                            key={ship.id}
                            id={ship.id}
                            src={SHIP_IMAGES[ship.size]}
                            initialPosition={{ x: displayX, y: displayY }}
                            direction={ship.orientation === 'hor' ? 'hor' : 'vert'}
                            onDirectionChange={handleDirectionChange}
                        />
                    );
                })}
            </DropZone>
            <div className="flex w-full items-center justify-center gap-4">
                {isReady ? renderPlayerReadyAlerts : renderReadyControls}
            </div>
            <CellsOverlay
                prefix="player"
                missCells={missCells}
                hitCells={hitCells}
                isReady={isReady}
            />
        </div>
    );
};
