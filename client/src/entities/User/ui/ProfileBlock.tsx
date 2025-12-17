import { Modal, ModalBody, ModalContent } from '@heroui/react';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { getMe } from '@/entities/User/model/services/getUserData';
import { RanksTable } from '@/entities/User/ui/RanksTable';

import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { Card } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';

import { getUserData } from '../model/selectors/userSelectors';
import { userRankMapper } from '../model/types/Ranks';

import { AuthBlock } from './AuthBlock';

export const ProfileBlock = () => {
    const userData = useSelector(getUserData);

    const dispatch = useAppDispatch();

    const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    const getUserWinrate = useMemo(() => {
        if (!userData?.gamesWon || !userData?.gamesPlayed) return 0;
        return (userData?.gamesWon / userData?.gamesPlayed) * 100;
    }, [userData?.gamesPlayed, userData?.gamesWon]);

    const getWinrateColor = useMemo(() => {
        if (getUserWinrate >= 65) return 'group-data-[has-value=true]:text-fuchsia-400';
        if (getUserWinrate >= 55) return 'group-data-[has-value=true]:text-success';
        if (getUserWinrate >= 50) return 'group-data-[has-value=true]:text-default-100';
        if (getUserWinrate >= 40) return 'group-data-[has-value=true]:text-warning';
        return 'group-data-[has-value=true]:text-danger';
    }, [getUserWinrate]);

    const handleShowRanksModal = useCallback(() => {
        setIsModalOpened(true);
    }, []);

    return (
        <Card
            className="h-[400px] w-full bg-red-200"
            title={userData?.id ? 'Профиль' : 'Авторизация'}
        >
            <AnimatePresence mode="wait">
                {userData?.id ? (
                    <motion.div
                        key="profile-data"
                        initial={{ x: -100, opacity: 0 }}
                        exit={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex flex-col gap-3"
                    >
                        <Input isReadOnly label="username" value={userData.username} />
                        <div className="flex w-full gap-2">
                            <Input
                                isReadOnly
                                label="игр сыграно"
                                value={String(userData.gamesPlayed)}
                            />
                            <Input
                                isReadOnly
                                label="игр выиграно"
                                value={String(userData.gamesWon)}
                            />
                            <Input
                                isReadOnly
                                label="% побед"
                                classNames={{
                                    input: getWinrateColor,
                                }}
                                value={getUserWinrate.toFixed(2) + '%'}
                            />
                        </div>
                        <div className="flex w-full gap-2">
                            <Input
                                isReadOnly
                                label="Рейтинг"
                                startContent="⚓"
                                value={String(userData.rating)}
                            />
                            <Input
                                onClick={handleShowRanksModal}
                                classNames={{ input: 'cursor-pointer' }}
                                isReadOnly
                                label="Звание"
                                value={userRankMapper[userData.rank]}
                            />
                        </div>
                    </motion.div>
                ) : (
                    <AuthBlock />
                )}
            </AnimatePresence>

            <Modal
                size="3xl"
                scrollBehavior="inside"
                isOpen={isModalOpened}
                onClose={() => setIsModalOpened(false)}
            >
                <ModalContent className="bg-gradient-to-br from-gradStart to-gradEnd">
                    <ModalBody>
                        <RanksTable />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Card>
    );
};
