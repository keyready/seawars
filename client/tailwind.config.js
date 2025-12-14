import { heroui } from '@heroui/react';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                gradStart: '#919BFF',
                gradEnd: '#133A94',
            },
            gradientColorStops: {
                gradStart: '#919BFF',
                gradEnd: '#133A94',
            },
            fontFamily: {
                'cs-font': ['CSGOFont', 'sans-serif'],
            },
        },
    },
    darkMode: 'class',
    plugins: [
        heroui({
            themes: {
                dark: {
                    colors: {
                        danger: '#f00',
                    },
                },
            },
        }),
    ],
};
