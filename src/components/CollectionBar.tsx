import React from 'react';
import { Tile } from './Tile';
import type { Tile as TileType } from '../types/types';
import './CollectionBar.css';

interface CollectionBarProps {
    tiles: TileType[];
}

export const CollectionBar: React.FC<CollectionBarProps> = ({ tiles }) => {
    // Fill empty slots up to 7
    const slots = Array(7).fill(null);
    tiles.forEach((t, i) => slots[i] = t);

    return (
        <div className="collection-bar">
            {slots.map((tile, index) => (
                <div key={index} className="bar-slot">
                    {tile && <Tile tile={tile} inBar={true} />}
                </div>
            ))}
        </div>
    );
};
