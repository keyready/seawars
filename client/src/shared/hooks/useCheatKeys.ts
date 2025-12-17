import { useEffect, useRef } from 'react';

type KeyCombo = readonly string[];

export const useMultiKeyCombo = (
    combo: KeyCombo,
    onMatch: () => void,
    options?: {
        target?: Window;
        enabled?: boolean;
        debounceMs?: number;
    },
) => {
    const { target = window, enabled = true, debounceMs = 50 } = options ?? {};

    const activeKeys = useRef<Set<string>>(new Set());
    const scheduledRef = useRef<number | null>(null);
    const comboSet = useRef<Set<string>>(new Set(combo));

    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (ev: KeyboardEvent) => {
            const code = ev.code;
            if (!comboSet.current.has(code)) return;

            activeKeys.current.add(code);

            if (scheduledRef.current) {
                clearTimeout(scheduledRef.current);
            }

            scheduledRef.current = setTimeout(() => {
                if (
                    activeKeys.current.size === comboSet.current.size &&
                    [...activeKeys.current].every((key) => comboSet.current.has(key))
                ) {
                    onMatch();
                }
            }, debounceMs);
        };

        const handleKeyUp = (ev: KeyboardEvent) => {
            const code = ev.code;
            if (comboSet.current.has(code)) {
                activeKeys.current.delete(code);
                if (scheduledRef.current) {
                    clearTimeout(scheduledRef.current);
                    scheduledRef.current = null;
                }
            }
        };

        target.addEventListener('keydown', handleKeyDown);
        target.addEventListener('keyup', handleKeyUp);

        return () => {
            target.removeEventListener('keydown', handleKeyDown);
            target.removeEventListener('keyup', handleKeyUp);
            if (scheduledRef.current) {
                clearTimeout(scheduledRef.current);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
            activeKeys.current.clear();
        };
    }, [combo, onMatch, enabled, debounceMs, target]);
};
