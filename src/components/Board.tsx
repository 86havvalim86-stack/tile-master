import React from 'react';
import { Tile } from './Tile';
import type { Tile as TileType } from '../types/types';
import './Board.css';

interface BoardProps {
    tiles: TileType[];
    onTileClick: (tile: TileType) => void;
}

export const Board: React.FC<BoardProps> = ({ tiles, onTileClick }) => {
    return (
        <div className="board-container">
            <div className="board-layers">
                {tiles.map(tile => (
                    <Tile
                        key={tile.id}
                        tile={tile}
                        onClick={onTileClick}
                    />
                ))}
            </div>
        </div>
    );
};
