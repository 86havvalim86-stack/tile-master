import type { Tile, TileSymbol } from '../types/types';

const SYMBOLS: TileSymbol[] = [
    'star', 'heart', 'moon', 'cloud', 'sun', 'zap', 'anchor', 'music', 'gem',
    'flower', 'flame', 'drop', 'leaf', 'bolt', 'key'
];

export const generateLevel = (level: number = 1): Tile[] => {
    const tiles: Tile[] = [];

    // Increase difficulty/size by level, but cap at some point
    // Level 1: ~90 tiles (Balanced start)
    // Level 2: ~117 tiles
    // Level 3+: ~144 tiles
    let totalTilesNeeded = 90 + (Math.min(level, 5) - 1) * 27;

    // Ensure multiple of 3
    if (totalTilesNeeded % 3 !== 0) totalTilesNeeded += (3 - (totalTilesNeeded % 3));

    // 1. Create pairs of 3
    let symbolPool: TileSymbol[] = [];
    while (symbolPool.length < totalTilesNeeded) {
        const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        symbolPool.push(sym, sym, sym);
    }
    symbolPool = symbolPool.slice(0, totalTilesNeeded).sort(() => Math.random() - 0.5);

    let index = 0;

    const addTile = (x: number, y: number, z: number) => {
        if (index >= symbolPool.length) return;
        tiles.push({
            id: crypto.randomUUID(),
            symbol: symbolPool[index++],
            x,
            y,
            layer: z,
            isBlocked: false
        });
    };

    // --- LEVEL PATTERNS ---

    // Level 1: Classic Pyramid (Standard)
    const generatePyramid = () => {
        // Base 7x7, then 5x5, then 3x3
        // Total: 49 + 25 + 9 = 83 tiles (approx)
        const layers = [
            { size: 7, z: 0 },
            { size: 5, z: 1, offset: 1 },
            { size: 3, z: 2, offset: 2 }
        ];

        // Add layers
        layers.forEach(layer => {
            for (let r = 0; r < layer.size; r++) {
                for (let c = 0; c < layer.size; c++) {
                    addTile(c + (layer.offset || 0), r + (layer.offset || 0), layer.z);
                }
            }
        });
    };

    // Level 2: Twin Towers
    const generateTowers = () => {
        // Two 3x3 stacks side by side with gap
        // Left Tower
        for (let z = 0; z < 3; z++) {
            for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) addTile(c, r, z);
        }
        // Right Tower (x offset 4)
        for (let z = 0; z < 3; z++) {
            for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) addTile(c + 4, r, z);
        }
        // Bridge at bottom
        for (let r = 3; r < 5; r++) for (let c = 0; c < 7; c++) addTile(c, r, 0);
    };

    // Level 3: The Wall (Wide)
    const generateWall = () => {
        // 8x6 base
        for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++) addTile(c, r, 0);
        // Random upper layers
        for (let i = 0; i < 30; i++) {
            addTile(Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 4) + 1, 1);
        }
        for (let i = 0; i < 10; i++) {
            addTile(Math.floor(Math.random() * 4) + 2, Math.floor(Math.random() * 2) + 2, 2);
        }
    };

    // Default / Randomized High Levels
    const generateRandom = () => {
        const cols = 7;
        const rows = 7;
        // Base layer full
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) addTile(c, r, 0);

        // Random piles
        const remaining = totalTilesNeeded - (cols * rows);
        for (let i = 0; i < remaining; i++) {
            const x = Math.floor(Math.random() * (cols - 1));
            const y = Math.floor(Math.random() * (rows - 1));
            const z = Math.floor(Math.random() * 3) + 1;
            addTile(x, y, z);
        }
    };


    switch (level) {
        case 1: generatePyramid(); break;
        case 2: generateTowers(); break;
        case 3: generateWall(); break;
        default: generateRandom(); break;
    }

    // Fill remaining if pattern didn't use all (for perfectly matching pairs logic)
    // Or just trim redundant?
    // Better: Allow loose tiles to fill gaps if index < total
    // For now simple fix: Just ensure we generated enough positions? 
    // Actually, distinct layouts have distinct counts.
    // The `totalTilesNeeded` calc at top is a target.
    // If the layout uses fewer slots than `totalTilesNeeded`, tiles property will capture them.
    // If layout demands MORE, it checks index check.

    // Correction: We must ensure the actual board has % 3 == 0 tiles.
    // If we stopped early or laid out weirdly, we might have leftovers.

    // Quick Fix: Truncate to multiple of 3 if over, or remove last few if remainder.
    const remainder = tiles.length % 3;
    if (remainder !== 0) {
        // Remove last few to match
        // Reverse loop to remove
        for (let i = 0; i < remainder; i++) tiles.pop();
    }

    return tiles;
};

export const updateBlockedStatus = (tiles: Tile[]): Tile[] => {
    return tiles.map(tile => {
        const isBlocked = tiles.some(other =>
            other.id !== tile.id &&
            other.layer > tile.layer &&
            Math.abs(other.x - tile.x) < 1 &&
            Math.abs(other.y - tile.y) < 1
        );
        return { ...tile, isBlocked };
    });
};
