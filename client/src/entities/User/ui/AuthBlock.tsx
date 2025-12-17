import { Button } from '@heroui/react';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';

import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

export const AuthBlock = () => {
    const [activeForm, setActiveForm] = useState<'login' | 'signup'>('login');

    const handleChangeAuth = useCallback(() => {
        setActiveForm((ps) => (ps === 'login' ? 'signup' : 'login'));
    }, []);

    return (
        <div className="flex w-full flex-col gap-4 overflow-x-hidden">
            <AnimatePresence mode="wait">
                {activeForm === 'login' ? (
                    <motion.div
                        key="form-login"
                        initial={{ x: -100, opacity: 0 }}
                        exit={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className=""
                    >
                        <LoginForm />
                    </motion.div>
                ) : (
                    <motion.div
                        key="form-signup"
                        initial={{ x: 100, opacity: 0 }}
                        exit={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className=""
                    >
                        <SignupForm />
                    </motion.div>
                )}
            </AnimatePresence>
            <Button color="primary" className="self-end" onPress={handleChangeAuth}>
                {activeForm === 'signup' ? 'Уже есть аккаунт?' : 'Еще нет аккаунта?'}
            </Button>
        </div>
    );
};
