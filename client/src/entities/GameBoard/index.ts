export type {
    GameBoardSchema,
    GameBoard,
    GameBoardType,
    Leaderboard,
    Room,
} from './model/types/GameBoard';
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
    getCurrentPlayerName,
    getOwnerFleet,
    getCurrentTurn,
    getGameRoom,
    getGamePhase,
    getGamingRooms,
    getLeaderboards,
} from './model/selectors/getGameBoard';

export type { BattlePhase } from './model/types/GameBoard';

export { DroppableShipBoard } from './ui/DroppableShipsBoard';

export { getSkirtAroundDestroyedShip } from './model/lib/getSkirtAroundDestroyedShip';
export type { CurrentPlayer } from './model/types/GameBoard';
