import { Socket } from 'socket.io-client';

export interface GameSocketSchema {
    socket: Socket | null;
}
