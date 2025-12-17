import { cn, Input as HeroInput, type InputProps } from '@heroui/react';

export const Input = ({ className, classNames, ...rest }: InputProps) => {
    return (
        <HeroInput
            {...rest}
            className={className}
            classNames={{
                ...classNames,
                inputWrapper: cn(
                    classNames?.inputWrapper,
                    'bg-blue-800 shadow-lg',
                    'data-[hover=true]:bg-blue-700',
                    'group-data-[focus=true]:bg-blue-600',
                ),
                label: cn(classNames?.label, 'group-invalid:text-[#ff4b33]'),
                errorMessage: cn(classNames?.errorMessage, 'text-[#ff4b33]'),
            }}
        />
    );
};
