import { cn } from '@heroui/react';
import { RiArrowRightSLine } from '@remixicon/react';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';

export const ChatPanel = () => {
    const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);

    const handleOpenChatClick = useCallback((ev: React.MouseEvent) => {
        ev.stopPropagation();
        setIsMenuOpened(true);
    }, []);

    return (
        <AnimatePresence mode="wait">
            {isMenuOpened ? (
                <motion.button
                    onClick={() => setIsMenuOpened(false)}
                    layoutId="chat-panel"
                    initial={{ width: 50 }}
                    exit={{ width: 300 }}
                    animate={{ width: 300 }}
                    className={cn(
                        'absolute left-[calc(100%_+_20px)] top-0 h-[400px]',
                        'rounded-md bg-blue-200/70 transition-colors duration-200',
                        'flex flex-col items-center justify-start gap-10 px-2 py-4',
                    )}
                >
                    <h1 className="text-lg font-bold text-blue-600">Игровой чат</h1>
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
