import { cn } from '@heroui/react';
import { RiArrowRightSLine } from '@remixicon/react';
import { ChatWindow } from 'src/features/Chat';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { getGameRoom } from '@/entities/GameBoard';
import { getUserData } from '@/entities/User';

export const ChatPanel = () => {
    const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);

    const roomId = useSelector(getGameRoom);
    const playerName = useSelector(getUserData)?.username;

    const handleOpenChatClick = useCallback((ev: React.MouseEvent) => {
        ev.stopPropagation();
        setIsMenuOpened(true);
    }, []);

    return (
        <AnimatePresence mode="wait">
            {isMenuOpened ? (
                <motion.button
                    onClick={(ev) => {
                        ev.stopPropagation();
                        setIsMenuOpened(false);
                    }}
                    type="button"
                    layoutId="chat-panel"
                    initial={{ width: 50 }}
                    exit={{ width: 300 }}
                    animate={{ width: 300 }}
                    className={cn(
                        'absolute left-[calc(100%_+_20px)] top-0 h-[400px]',
                        'rounded-md bg-blue-200/70 transition-colors duration-200',
                        'flex flex-col items-center justify-start gap-2 px-2 py-4',
                    )}
                >
                    <h1 className="text-lg font-bold text-blue-600">Игровой чат</h1>
                    <ChatWindow roomId={roomId} playerName={playerName} />
                </motion.button>
            ) : (
                <motion.button
                    onClick={handleOpenChatClick}
                    type="button"
                    layoutId="chat-panel"
                    initial={{ width: 300 }}
                    exit={{ width: 50, height: 50 }}
                    animate={{ width: 50, height: 50 }}
                    className={cn(
                        'absolute left-[calc(100%_+_20px)] top-0 h-[400px]',
                        'rounded-md transition-colors duration-200',
                        'flex flex-col items-center justify-center',
                        'hover:bg-blue-200 hover:text-blue-700',
                    )}
                >
                    <RiArrowRightSLine />
                </motion.button>
            )}
        </AnimatePresence>
    );
};
