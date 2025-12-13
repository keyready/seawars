import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

// Singleton для socket соединения
let socketInstance: Socket | null = null;

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const isInitialized = useRef(false);

    useEffect(() => {
        // Создаем socket только один раз
        if (!socketInstance && !isInitialized.current) {
            isInitialized.current = true;
            socketInstance = io('http://localhost:5000', {
                path: '/socket',
                reconnection: true,
            });
            setSocket(socketInstance);
        } else if (socketInstance) {
            // Если socket уже существует, используем его
            setSocket(socketInstance);
        }

        // Не закрываем socket при размонтировании, так как он должен жить все время приложения
        return () => {
            // Cleanup не нужен, socket остается активным
        };
    }, []);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
