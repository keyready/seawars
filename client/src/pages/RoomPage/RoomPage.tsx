import {
    Button,
    ButtonGroup,
    cn,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@heroui/react';

import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useBlocker, useParams } from 'react-router';

import { Page } from '@/widgets/Page';

import { DroppableShipBoard } from '@/entities/GameBoard';
import { getUserData } from '@/entities/User';

import { useGameActions } from '@/shared/hooks/useGameSocket';

export default function RoomPage() {
    const { roomId } = useParams<{ roomId: string }>();
    const { getRoomInfo, handlePlayerLeaveRoom } = useGameActions();

    const [isLeaveModalEnabled, setIsLeaveModalEnabled] = useState<boolean>(false);

    const name = useSelector(getUserData)?.username || '';
    const blocker = useBlocker(true);

    useEffect(() => {
        if (blocker.state === 'blocked') {
            setIsLeaveModalEnabled(true);
        } else {
            setIsLeaveModalEnabled(false);
        }
    }, [blocker]);

    useEffect(() => {
        if (roomId && name) {
            getRoomInfo(roomId, name);
        }
    }, [roomId, name, getRoomInfo]);

    const handleLeaveRoom = useCallback(() => {
        handlePlayerLeaveRoom();
        blocker.proceed?.();
    }, [blocker, handlePlayerLeaveRoom]);

    if (!roomId) return <Navigate to="/" />;

    return (
        <Page>
            <header className="flex flex-col gap-10 text-center">
                <h1
                    className={cn(
                        'bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text',
                        'font-cs-font text-5xl font-bold italic text-transparent',
                    )}
                >
                    Морской бой
                </h1>
            </header>

            <div className="flex flex-col items-start justify-center gap-8 md:flex-row">
                <div className="flex flex-col items-center justify-center gap-6 text-center">
                    <h2 className="mb-2 text-lg font-semibold">Ваш флот</h2>
                    <DroppableShipBoard type="own" />
                </div>

                <div className="flex flex-col gap-6 text-center">
                    <h2 className="mb-2 text-lg font-semibold">Флот противника</h2>
                    <DroppableShipBoard type="enemy" />
                </div>
            </div>

            <Modal backdrop="blur" isOpen={isLeaveModalEnabled} size="3xl">
                <ModalContent className="text-white">
                    <ModalHeader className="text-danger">Просто сбежите?</ModalHeader>
                    <ModalBody>
                        <h1 className="text-lg">Вы собираетесь покинуть поле боя!</h1>
                        <h2 className="text-sm">Как потом смотреть в глаза однополчанам???</h2>
                    </ModalBody>
                    <ModalFooter>
                        <div className="flex items-center gap-3">
                            <ButtonGroup size="sm">
                                <Button onPress={handleLeaveRoom} color="danger">
                                    Сбежать!
                                </Button>
                                <Button onPress={handleLeaveRoom} color="danger">
                                    Ретироваться!
                                </Button>
                                <Button onPress={blocker.reset} color="success">
                                    Драться, как лев
                                </Button>
                            </ButtonGroup>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Page>
    );
}
