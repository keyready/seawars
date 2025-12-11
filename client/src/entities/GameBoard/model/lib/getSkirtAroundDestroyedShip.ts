import type { Cell } from '@/entities/Ship';

export const getSkirtAroundDestroyedShip = (hitCells: Cell[], pos: Cell): Cell[] => {
    const hitSet = new Set(hitCells.map(({ r, c }) => `${r},${c}`));

    const shipCells: Cell[] = [];
    const visited = new Set<string>();

    const dfs = (r: number, c: number) => {
        const key = `${r},${c}`;
        if (visited.has(key) || !hitSet.has(key)) return;

        visited.add(key);
        shipCells.push({ r, c });

        const neighbors = [
            { r: r - 1, c },
            { r: r + 1, c },
            { r, c: c - 1 },
            { r, c: c + 1 },
        ];

        for (const { r: nr, c: nc } of neighbors) {
            dfs(nr, nc);
        }
    };

    dfs(pos.r, pos.c);

    if (shipCells.length === 0) return [];

    let rMin = Infinity,
        rMax = -Infinity;
    let cMin = Infinity,
        cMax = -Infinity;

    for (const { r, c } of shipCells) {
        rMin = Math.min(rMin, r);
        rMax = Math.max(rMax, r);
        cMin = Math.min(cMin, c);
        cMax = Math.max(cMax, c);
    }

    const skirtSet = new Set<string>();

    for (let r = rMin - 1; r <= rMax + 1; r++) {
        for (let c = cMin - 1; c <= cMax + 1; c++) {
            if (hitSet.has(`${r},${c}`)) continue;

            if (r === rMin - 1 || r === rMax + 1 || c === cMin - 1 || c === cMax + 1) {
                skirtSet.add(`${r},${c}`);
            }
        }
    }

    return Array.from(skirtSet)
        .map((key) => {
            const [r, c] = key.split(',').map(Number);
            return { r, c };
        })
        .filter((cell) => cell.r < 10 && cell.c < 10 && cell.r >= 0 && cell.c >= 0);
};
