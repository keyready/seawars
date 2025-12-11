import type { Cell, ShipOrientation } from '@/entities/Ship';

import type { Fleet } from '../types/GameBoard';

import { getShipCells, hasCollision, isShipInBounds } from './utils';

export const updateShip = (
    shipId: string,
    ships: Fleet,
    updates: { head?: Cell; orientation?: ShipOrientation },
) => {
    const ship = ships.find((s) => s.id === shipId);
    if (!ship) return ships;

    const newOrientation = updates.orientation ?? ship.orientation;

    const newHead = updates.head ?? ship.head;

    const newCells = getShipCells(newHead, ship.size, newOrientation);

    if (!isShipInBounds(newCells)) {
        console.warn(
            `Корабль ${shipId} выходит за пределы при ${updates.orientation ? 'повороте' : 'перемещении'}`,
        );
        return ships;
    }

    const otherShips = ships.filter((s) => s.id !== shipId);
    if (hasCollision(newCells, otherShips)) {
        console.warn(`Корабль ${shipId} пересекается с другими`);
        return ships;
    }

    console.log('Повернули или переместили корабль');

    return ships.map((s) =>
        s.id === shipId ? { ...s, head: newHead, orientation: newOrientation, cells: newCells } : s,
    );
};
