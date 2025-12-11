export type TileSymbol = 'star' | 'heart' | 'moon' | 'cloud' | 'sun' | 'zap' | 'anchor' | 'music' | 'gem' | 'flower' | 'flame' | 'drop' | 'leaf' | 'bolt' | 'key';

export interface Tile {
  id: string;
  symbol: TileSymbol;
  x: number;      // Grid position X
  y: number;      // Grid position Y
  layer: number;  // Z-index / Stack layer
  isBlocked?: boolean; // If true, cannot be clicked
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface GameState {
  player: Player;
  board: Tile[];        // All tiles on the board
  collectionBar: Tile[]; // Tiles in the 7-slot bar
  isGameOver: boolean;
  isVictory: boolean;
  level: number;
}
