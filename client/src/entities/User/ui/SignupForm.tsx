import { addToast, Button } from '@heroui/react';
import { yupResolver } from '@hookform/resolvers/yup';

import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { signupUser } from '@/entities/User';

import { useAppDispatch } from '@/shared/hooks/useAppDispatch';
import { Input } from '@/shared/ui/Input';

import type { LoginSchema } from '../model/types/User';
import { registrationSchema } from '../model/types/UserFormSchemas';

export const SignupForm = () => {
    const dispatch = useAppDispatch();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: yupResolver(registrationSchema),
        mode: 'onChange',
    });

    const handleFormSubmit = useCallback(
        (user: LoginSchema) => {
            addToast({
                promise: dispatch(signupUser(user)),
                title: 'Регистрируем вас...',
            });
        },
        [dispatch],
    );

    return (
        <form className="flex w-full flex-col gap-2" onSubmit={handleSubmit(handleFormSubmit)}>
            <Controller
                render={({ field }) => (
                    <Input
                        value={field.value}
                        onValueChange={field.onChange}
                        isInvalid={Boolean(errors.username?.message)}
                        errorMessage={errors.username?.message}
                        label="Введите логин"
                    />
                )}
                name="username"
                control={control}
            />
            <Controller
                render={({ field }) => (
                    <Input
                        value={field.value}
                        onValueChange={field.onChange}
                        isInvalid={Boolean(errors.password?.message)}
                        errorMessage={errors.password?.message}
                        label="Введите пароль"
                    />
                )}
                name="password"
                control={control}
            />
            <Button className="self-end bg-blue-700" type="submit">
                Зарегистрироваться
            </Button>
        </form>
    );
};
