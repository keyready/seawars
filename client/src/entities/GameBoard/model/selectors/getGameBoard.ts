import type { StateSchema } from '@/store/StateSchema';

export const getOwnerGameboard = (state: StateSchema) => state.board.ownerBoard.grid;
export const getOwnerFleet = (state: StateSchema) => state.board.ownerBoard.fleet;
export const getIsPlayerReady = (state: StateSchema) => state.board.isPlayerReady;

export const getEnemyGameboard = (state: StateSchema) => state.board.enemyBoard;
export const getCurrentTurn = (state: StateSchema) => state.board.currentPlayer;

export const getGameRoom = (state: StateSchema) => state.board.room;
export const getGamePhase = (state: StateSchema) => state.board.phase;
export const getGamingRooms = (state: StateSchema) => state.board.existingRooms;
