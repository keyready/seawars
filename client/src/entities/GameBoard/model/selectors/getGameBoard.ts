import type { StateSchema } from '@/store/StateSchema';

export const getOwnerGameboard = (state: StateSchema) => state.board.ownerBoard.grid;
export const getOwnerFleet = (state: StateSchema) => state.board.ownerBoard.fleet;
export const getEnemyGameboard = (state: StateSchema) => state.board.enemyBoard.grid;
export const getEnemyFleet = (state: StateSchema) => state.board.enemyBoard.fleet;
export const getCurrentTurn = (state: StateSchema) => state.board.currentPlayer;
export const getCurrentPlayerName = (state: StateSchema) => state.board.name;
export const getGameRoom = (state: StateSchema) => state.board.room;
export const getGamePhase = (state: StateSchema) => state.board.phase;
export const getGamingRooms = (state: StateSchema) => state.board.existingRooms;
export const getLeaderboards = (state: StateSchema) => state.board.leaderboard;
