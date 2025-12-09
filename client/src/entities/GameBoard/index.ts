export type { GameBoardSchema, GameBoard, GameBoardType } from './model/types/GameBoard';
export { CellState } from './model/types/GameBoard';
export { GameboardActions, GameboardReducer } from './model/slice/GameBoardSlice';

export {
    type ShipSize,
    type Ship,
    ShipOrientation,
    type CellPosition,
    CellStatus,
} from '../Ship/model/types/Ship';

export {
    getOwnerGameboard,
    getEnemyGameboard,
    getEnemyFleet,
    getCurrentPlayerName,
    getOwnerFleet,
} from './model/selectors/getGameBoard';

export { fleetToGrid } from './model/lib/fleetToGrid';
export { generateRandomFleet } from './model/lib/generateFleet';
export { getCurrentTurn } from './model/selectors/getGameBoard';
export type { BattlePhase } from './model/types/GameBoard';
