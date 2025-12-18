import { cn } from '@heroui/react';
import { RiArrowLeftSLine } from '@remixicon/react';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { GameboardActions } from '@/entities/GameBoard';
import type { HelpToolsTypes } from '@/entities/GameBoard/model/types/GameBoard';

import { useAppDispatch } from '@/shared/hooks/useAppDispatch';

import { getHelpTools } from '../model/selectors/getGameBoard';

export const WeaknessSupport = () => {
    const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const helpTools = useSelector(getHelpTools);

    const handleHelpClicked = useCallback(
        (ev: React.MouseEvent, type: HelpToolsTypes) => {
            ev.stopPropagation();
            dispatch(
                GameboardActions.setHelpTools({
                    enabled: helpTools?.enabled === type ? undefined : type,
                }),
            );
        },
        [dispatch, helpTools?.enabled],
    );

    return (
        <AnimatePresence mode="wait">
            {isMenuOpened ? (
                <motion.button
                    onClick={() => setIsMenuOpened(false)}
                    layoutId="weakness-support-panel"
                    initial={{ width: 300 }}
                    exit={{ width: 50, height: 50 }}
                    animate={{ width: 50, height: 50 }}
                    className={cn(
                        'absolute right-[calc(100%_+_20px)] top-0 h-[400px]',
                        'rounded-md transition-colors duration-200',
                        'flex flex-col items-center justify-center',
                        'hover:bg-blue-200 hover:text-blue-700',
                    )}
                >
                    <RiArrowLeftSLine />
                </motion.button>
            ) : (
                <motion.button
                    onClick={() => setIsMenuOpened(true)}
                    layoutId="weakness-support-panel"
                    initial={{ width: 50 }}
                    exit={{ width: 300 }}
                    animate={{ width: 300 }}
                    className={cn(
                        'absolute right-[calc(100%_+_20px)] top-0 h-[400px]',
                        'rounded-md bg-blue-200/70 transition-colors duration-200',
                        'flex flex-col items-center justify-start gap-10 px-2 py-4',
                    )}
                >
                    <h1 className="text-lg font-bold text-blue-600">Помощь для слабых</h1>

                    <div className="flex w-full flex-col gap-5">
                        <button
                            type="button"
                            onClick={(ev) => handleHelpClicked(ev, 'airplane')}
                            className={cn(
                                'group flex w-full items-center justify-between',
                                'rounded-md p-1 duration-100 hover:bg-sky-200',
                                helpTools?.enabled === 'airplane' ? 'bg-sky-200' : '',
                            )}
                        >
                            <img src="/ships/air-help.webp" className="w-[100px]" alt="" />
                            <span
                                className={cn(
                                    helpTools?.enabled === 'airplane' ? 'text-blue-500' : '',
                                    'duration-100 group-hover:text-blue-500',
                                )}
                            >
                                300 ⚓
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={(ev) => handleHelpClicked(ev, 'rocket')}
                            className={cn(
                                'group flex w-full items-center justify-between',
                                'rounded-md p-1 duration-100 hover:bg-sky-200',
                                helpTools?.enabled === 'rocket' ? 'bg-sky-200' : '',
                            )}
                        >
                            <img src="/ships/rocket.webp" className="w-[40px]" alt="" />
                            <span
                                className={cn(
                                    helpTools?.enabled === 'rocket' ? 'text-blue-500' : '',
                                    'duration-100 group-hover:text-blue-500',
                                )}
                            >
                                100 ⚓
                            </span>
                        </button>
                    </div>
                </motion.button>
            )}
        </AnimatePresence>
    );
};
