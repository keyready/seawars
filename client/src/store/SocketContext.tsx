// SocketProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const s = io('http://localhost:5000', {
            reconnection: true,
        });
        setSocket(s);
        return () => void s.close();
    }, []);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
