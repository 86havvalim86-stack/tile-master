import React from 'react';
import type { Tile as TileType } from '../types/types';
import { Star, Heart, Moon, Cloud, Sun, Zap, Anchor, Music, Diamond, Flower, Flame, Droplets, Leaf, Key } from 'lucide-react';
import './Tile.css';

interface TileProps {
    tile: TileType;
    onClick?: (tile: TileType) => void;
    inBar?: boolean;
}

export const Tile: React.FC<TileProps> = ({ tile, onClick, inBar }) => {

    const handleClick = () => {
        if (!tile.isBlocked && onClick) {
            onClick(tile);
        }
    };

    const renderIcon = () => {
        const iconProps = { size: inBar ? 24 : 32, strokeWidth: 2.5 };

        switch (tile.symbol) {
            case 'star': return <Star {...iconProps} color="#f1c40f" fill="#f1c40f" fillOpacity={0.2} />;
            case 'heart': return <Heart {...iconProps} color="#e74c3c" fill="#e74c3c" fillOpacity={0.2} />;
            case 'moon': return <Moon {...iconProps} color="#8e44ad" fill="#8e44ad" fillOpacity={0.2} />;
            case 'cloud': return <Cloud {...iconProps} color="#3498db" fill="#3498db" fillOpacity={0.2} />;
            case 'sun': return <Sun {...iconProps} color="#e67e22" fill="#e67e22" fillOpacity={0.2} />;
            case 'zap': return <Zap {...iconProps} color="#f39c12" fill="#f39c12" fillOpacity={0.2} />;
            case 'anchor': return <Anchor {...iconProps} color="#2c3e50" />;
            case 'music': return <Music {...iconProps} color="#d35400" />;
            case 'gem': return <Diamond {...iconProps} color="#2ecc71" fill="#2ecc71" fillOpacity={0.2} />;
            case 'flower': return <Flower {...iconProps} color="#e91e63" fill="#e91e63" fillOpacity={0.2} />;
            case 'flame': return <Flame {...iconProps} color="#c0392b" fill="#c0392b" fillOpacity={0.2} />;
            case 'drop': return <Droplets {...iconProps} color="#3498db" fill="#3498db" fillOpacity={0.2} />;
            case 'leaf': return <Leaf {...iconProps} color="#27ae60" fill="#27ae60" fillOpacity={0.2} />;
            case 'bolt': return <Zap {...iconProps} color="#7f8c8d" fill="#7f8c8d" fillOpacity={0.2} />;
            case 'key': return <Key {...iconProps} color="#d35400" />;
            default: return null;
        }
    };

    // Calculate position for Board Tiles
    const style: React.CSSProperties = inBar ? {} : {
        position: 'absolute',
        left: `${tile.x * 50 + 20}px`, // 50px grid size
        top: `${tile.y * 50 + 50}px`,
        zIndex: tile.layer * 10,
        filter: tile.isBlocked ? 'brightness(0.6)' : 'none',
        pointerEvents: tile.isBlocked ? 'none' : 'auto',
        transform: `translate(${tile.layer * 4}px, ${tile.layer * -4}px)` /* Slight 3D offset */
    };

    return (
        <div
            onClick={handleClick}
            style={style}
            className={`tile ${inBar ? 'tile-bar' : 'tile-board'} ${tile.isBlocked ? 'blocked' : ''}`}
        >
            <div className="tile-inner">
                {renderIcon()}
            </div>
        </div>
    );
};
