export const generateShips = () => {
    const ships: { id: string; size: number }[] = [];
    const sizes = [4, 3, 2, 1];
    const counts = [1, 2, 3, 4];

    sizes.forEach((size, i) => {
        for (let j = 0; j < counts[i]; j++) {
            ships.push({ id: `ship-${size}-${j}`, size });
        }
    });
    return ships;
};
