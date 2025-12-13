import { cn } from '@heroui/react';

import { EnterRoomForm } from '@/widgets/EnterRoomForm';
import { Page } from '@/widgets/Page';

import { useGameActions } from '@/shared/hooks/useGameSocket';

export function App() {
    useGameActions();

    return (
        <Page>
            <header className="flex flex-col gap-10 text-center">
                <h1
                    className={cn(
                        'bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text',
                        'text-5xl font-bold italic text-transparent',
                    )}
                >
                    Морской бой
                </h1>
            </header>
            <EnterRoomForm />
        </Page>
    );
}
