import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { createRoot } from 'react-dom/client';

import { StrictMode } from 'react';

import App from './App.tsx';

import { SocketProvider } from '@/store/SocketContext';
import { StoreProvider } from '@/store/StoreProvider';

import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SocketProvider>
            <HeroUIProvider>
                <ToastProvider placement="top-left" toastOffset={20} />
                <StoreProvider>
                    <App />
                </StoreProvider>
            </HeroUIProvider>
        </SocketProvider>
    </StrictMode>,
);
