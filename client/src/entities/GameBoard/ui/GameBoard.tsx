import './GameBoard.css';
import { Alert, Button, cn, Input } from '@heroui/react';

import { type FormEvent, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { GameboardActions, getCurrentPlayerName, getCurrentTurn } from '@/entities/GameBoard';
import { getGamePhase } from '@/entities/GameBoard/model/selectors/getGameBoard';

import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { useGameActions } from '@/shared/hooks/useGameSocket';

import { CellState, type CurrentPlayer } from '../model/types/GameBoard';

interface GameboardProps {
    type: CurrentPlayer;
}

export const Gameboard = ({ type }: GameboardProps) => {
    const dispatch = useAppDispatch();

    const currentTurn = useSelector(getCurrentTurn);
    const currentName = useSelector(getCurrentPlayerName);
    const gamePhase = useSelector(getGamePhase);

    const { generateFleet, startGame, fire, ownerGameboard, enemyGameboard, isReady } =
        useGameActions();

    const handleChangePlayerName = useCallback(
        (name: string) => {
            dispatch(GameboardActions.setName(name));
        },
        [dispatch],
    );

    const handleGameReady = useCallback(
        (ev: FormEvent<HTMLFormElement>) => {
            ev.preventDefault();
            startGame();
        },
        [startGame],
    );

    const getCellClass = (state: CellState): string => {
        switch (state) {
            case CellState.Ship:
                return 'bg-blue-600 rounded-md';
            case CellState.Destroyed:
                return 'bg-red-900 rounded-md';
            case CellState.Hit:
                return 'bg-red-600';
            case CellState.Miss:
                return 'bg-gray-200';
            case CellState.Empty:
            default:
                return 'bg-blue-300';
        }
    };

    if (type === 'me') {
        return (
            <div className="flex flex-col items-center justify-center gap-6 text-center">
                <div
                    className={cn(
                        'grid grid-cols-10',
                        'h-[401px] w-[401px]',
                        'border-t border-l border-slate-900',
                    )}
                >
                    {ownerGameboard.map((row, r) =>
                        row.map((cellState, c) => (
                            <span
                                key={`owner-${r}-${c}`}
                                className={cn(
                                    'flex h-10 w-10 items-center justify-center',
                                    'border-r border-b border-slate-900',
                                    getCellClass(cellState),
                                )}
                            >
                                {cellState === CellState.Ship && '⛴'}
                                {cellState === CellState.Hit && '×'}
                                {cellState === CellState.Miss && '•'}
                            </span>
                        )),
                    )}
                </div>

                {!isReady && (
                    <div className="flex w-full items-center justify-center gap-4">
                        <Button color="primary" size="sm" onPress={generateFleet}>
                            Сгенерировать флот
                        </Button>

                        <form onSubmit={handleGameReady} className="flex items-center gap-2">
                            <Input
                                onValueChange={handleChangePlayerName}
                                value={currentName}
                                size="sm"
                                placeholder="Ваше имя"
                            />
                            <Button
                                size="sm"
                                color="danger"
                                isDisabled={!currentName}
                                type="submit"
                            >
                                К бою готов!
                            </Button>
                        </form>
                    </div>
                )}

                {gamePhase === 'placing' ? (
                    <Alert color="primary">
                        <p>Ожидание второго игрока</p>
                    </Alert>
                ) : (
                    <Alert color={currentTurn === 'me' ? 'success' : 'warning'}>
                        {currentTurn === 'me' ? 'Ваш ход' : 'Ожидайте'}
                    </Alert>
                )}
            </div>
        );
    }

    return (
        <div
            className={cn(
                'grid grid-cols-10',
                'h-[401px] w-[401px]',
                'border-t border-l border-slate-900',
            )}
        >
            {enemyGameboard.map((row, r) =>
                row.map((cellState, c) => (
                    <button
                        key={`enemy-${r}-${c}`}
                        type="button"
                        onClick={() => fire(r, c)}
                        disabled={currentTurn !== 'me'}
                        className={cn(
                            'flex h-10 w-10 items-center justify-center',
                            'border-r border-b border-slate-900',
                            'text-xs font-bold duration-150 select-none',
                            'duration-100 hover:bg-slate-300',
                            'disabled:cursor-not-allowed',
                            getCellClass(cellState),
                        )}
                    >
                        {cellState === CellState.Hit && '×'}
                        {cellState === CellState.Miss && '•'}
                    </button>
                )),
            )}
        </div>
    );
};
