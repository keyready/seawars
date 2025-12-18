import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

let socketInstance: Socket | null = null;

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const isInitialized = useRef(false);

    useEffect(() => {
        if (!socketInstance && !isInitialized.current) {
            isInitialized.current = true;
            socketInstance = io(
                // 'http://192.168.0.102:5000',
                'http://localhost:5000',
                {
                    path: '/socket',
                    reconnection: true,
                },
            );
            setSocket(socketInstance);
        } else if (socketInstance) {
            setSocket(socketInstance);
        }

        return () => {};
    }, []);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
