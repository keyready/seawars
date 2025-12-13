import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';

import { StrictMode } from 'react';
import { createBrowserRouter } from 'react-router';

import { App } from '@/app/App';

import { SocketProvider } from '@/store/SocketContext';
import { StoreProvider } from '@/store/StoreProvider';

import './app/index.css';
import RoomPage from './pages/RoomPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: ':roomId',
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
