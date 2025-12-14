import { cn, Input as HeroInput, type InputProps } from '@heroui/react';

export const Input = ({ className, ...rest }: InputProps) => {
    return (
        <HeroInput
            {...rest}
            className={className}
            classNames={{
                inputWrapper: cn(
                    'bg-blue-800 shadow-lg',
                    'data-[hover=true]:bg-blue-700',
                    'group-data-[focus=true]:bg-blue-600',
                ),
                label: 'group-invalid:text-[#ff4b33]',
                errorMessage: 'text-[#ff4b33]',
            }}
        />
    );
};
