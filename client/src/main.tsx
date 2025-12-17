import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';

import { StrictMode } from 'react';
import { createBrowserRouter } from 'react-router';

import MainPage from '@/pages/MainPage';
import RoomPage from '@/pages/RoomPage';

import { SocketProvider } from '@/store/SocketContext';
import { StoreProvider } from '@/store/StoreProvider';

import './app/index.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainPage />,
    },
    {
        path: '/battle/:roomId',
        element: <RoomPage />,
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SocketProvider>
            <HeroUIProvider>
                <ToastProvider
                    toastProps={{ timeout: 1500 }}
                    placement="top-left"
                    toastOffset={20}
                />
                <StoreProvider>
                    <RouterProvider router={router} />
                </StoreProvider>
            </HeroUIProvider>
        </SocketProvider>
    </StrictMode>,
);
