import { type CellPosition, CellState } from '@/entities/GameBoard';

export const setShipDestroyed = (board: CellState[][], pos: CellPosition) => {
    const boardCopy = board.map((row) => [...row]);

    const shipCells: { r: number; c: number }[] = [];
    const visited = new Set<string>();

    const dfs = (r: number, c: number) => {
        const key = `${r},${c}`;
        if (
            r < 0 ||
            r >= boardCopy.length ||
            c < 0 ||
            c >= boardCopy[0].length ||
            visited.has(key) ||
            boardCopy[r][c] !== CellState.Hit
        )
            return;

        visited.add(key);
        shipCells.push({ r, c });

        dfs(r - 1, c);
        dfs(r + 1, c);
        dfs(r, c - 1);
        dfs(r, c + 1);
    };

    dfs(pos.r, pos.c);

    const skirtCells = new Set<string>();
    for (const cell of shipCells) {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;

                const nr = cell.r + dr;
                const nc = cell.c + dc;

                if (nr >= 0 && nr < boardCopy.length && nc >= 0 && nc < boardCopy[0].length) {
                    const current = boardCopy[nr][nc];
                    if (current !== CellState.Hit && current !== CellState.Destroyed) {
                        skirtCells.add(`${nr},${nc}`);
                    }
                }
            }
        }
    }

    for (const key of skirtCells) {
        const [r, c] = key.split(',').map(Number);
        boardCopy[r][c] = CellState.Miss;
    }

    return boardCopy;
};
