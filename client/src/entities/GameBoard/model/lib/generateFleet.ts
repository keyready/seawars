import { type Cell, ShipOrientation, type ShipSize } from '@/entities/Ship';

import type { Fleet } from '../types/GameBoard';

import { getShipCells, getShipForbiddenZone, isShipInBounds } from './utils';

const randInt = (min: number, max: number, rng = Math.random): number =>
    Math.floor(rng() * (max - min + 1)) + min;

const canPlaceShip = (candidateCells: Cell[], placedShips: Fleet): boolean => {
    if (!isShipInBounds(candidateCells)) return false;

    const forbidden = new Set<string>();
    placedShips.forEach((ship) => {
        getShipForbiddenZone(ship.cells).forEach((c) => forbidden.add(`${c.r},${c.c}`));
    });

    return !candidateCells.some((c) => forbidden.has(`${c.r},${c.c}`));
};

export const generateRandomFleet = (seed?: number): Fleet => {
    const rng =
        seed != null
            ? (() => {
                  let state = seed;
                  return () => {
                      state = (state * 16807) % 2147483647;
                      return (state - 1) / 2147483646;
                  };
              })()
            : Math.random;

    const shipSpecs: [number, number][] = [
        [4, 1],
        [3, 2],
        [2, 3],
        [1, 4],
    ];

    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
        attempts++;
        const placedShips: Fleet = [];
        let success = true;

        for (const [size, count] of shipSpecs) {
            for (let i = 0; i < count; i++) {
                let placed = false;
                let tries = 0;
                const maxTries = 1000;

                while (!placed && tries < maxTries) {
                    tries++;

                    const orientation: ShipOrientation =
                        size === 1
                            ? ShipOrientation.Horizontal
                            : randInt(0, 1, rng)
                              ? ShipOrientation.Horizontal
                              : ShipOrientation.Vertical;

                    const maxX = orientation === ShipOrientation.Horizontal ? 10 - size : 9;
                    const maxY = orientation === ShipOrientation.Vertical ? 10 - size : 9;

                    if (maxX < 0 || maxY < 0) continue;

                    const head: Cell = {
                        r: randInt(0, maxX, rng),
                        c: randInt(0, maxY, rng),
                    };

                    const cells = getShipCells(head, size, orientation);

                    if (canPlaceShip(cells, placedShips)) {
                        placedShips.push({
                            id: `ship-${size}-${i}-${attempts}`,
                            size: size as ShipSize,
                            orientation,
                            head,
                            cells,
                            hitCells: [],
                        });
                        placed = true;
                    }
                }

                if (!placed) {
                    success = false;
                    break;
                }
            }
            if (!success) break;
        }

        if (success && placedShips.length === 10) {
            return placedShips;
        }
    }

    console.error('Не удалось сгенерировать флот за', maxAttempts, 'попыток');
    return [];
};
