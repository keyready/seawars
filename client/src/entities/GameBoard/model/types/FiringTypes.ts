import type { CellPosition } from '../../../Ship/model/types/Ship';

export type SocketMessage =
    | { type: 'join-room'; payload: { roomId: string } }
    | { type: 'fleet-ready'; payload: { fleetHash: string } } // для подтверждения готовности
    | { type: 'fire'; payload: CellPosition }
    | {
          type: 'fire-response';
          payload: {
              pos: CellPosition;
              result: 'hit' | 'miss';
              sunkShipId?: string;
          };
      }
    | { type: 'game-over'; payload: { winner: 'me' | 'opponent' } };
