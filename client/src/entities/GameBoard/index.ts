export type { GameBoardSchema, GameBoard, GameBoardType, Fleet } from './model/types/GameBoard';
export { CellState } from './model/types/GameBoard';
export { GameboardActions, GameboardReducer } from './model/slice/GameBoardSlice';

export {
    type ShipSize,
    type Ship,
    ShipOrientation,
    type CellPosition,
} from '../Ship/model/types/Ship';

export {
    getOwnerGameboard,
    getEnemyGameboard,
    getOwnerFleet,
    getCurrentTurn,
    getGameRoom,
    getGamePhase,
    getGamingRooms,
} from './model/selectors/getGameBoard';

export type { BattlePhase } from './model/types/GameBoard';

export { DroppableShipBoard } from './ui/DroppableShipsBoard';

export { getSkirtAroundDestroyedShip } from './model/lib/getSkirtAroundDestroyedShip';
export type { CurrentPlayer } from './model/types/GameBoard';
