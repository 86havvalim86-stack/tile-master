import { useState, useCallback } from 'react';
import type { GameState, Tile } from '../types/types';
import { generateLevel, updateBlockedStatus } from '../utils/gameUtils';

export const useGameEngine = () => {
    const [gameState, setGameState] = useState<GameState>({
        player: { id: 'p1', name: 'Player 1', score: 0 },
        board: [],
        collectionBar: [],
        isGameOver: false,
        isVictory: false,
        level: 1
    });
    const [history, setHistory] = useState<GameState[]>([]);

    const initializeGame = useCallback((level: number = 1, keepScore: number = 0) => {
        const rawBoard = generateLevel(level);
        const boardWithStatus = updateBlockedStatus(rawBoard);

        setGameState({
            player: { id: 'p1', name: 'Player 1', score: keepScore }, // Keep score if advancing
            board: boardWithStatus,
            collectionBar: [],
            isGameOver: false,
            isVictory: false,
            level: level
        });
        setHistory([]);
    }, []);

    const nextLevel = useCallback(() => {
        initializeGame(gameState.level + 1, gameState.player.score);
    }, [gameState.level, gameState.player.score, initializeGame]);

    const restartGame = useCallback(() => {
        initializeGame(1, 0);
    }, [initializeGame]);

    const undoMove = useCallback(() => {
        setHistory(prev => {
            if (prev.length === 0) return prev;
            const newHistory = [...prev];
            const previousState = newHistory.pop();
            if (previousState) {
                setGameState(previousState);
            }
            return newHistory;
        });
    }, []);

    const handleTileClick = useCallback((clickedTile: Tile) => {
        if (clickedTile.isBlocked) return;
        if (gameState.isGameOver || gameState.isVictory) return;
        if (gameState.collectionBar.length >= 7) return;

        setHistory(prev => [...prev, gameState]);

        setGameState(prev => {
            // 1. Move Tile from Board to Bar
            const newBoard = prev.board.filter(t => t.id !== clickedTile.id);
            const updatedBoard = updateBlockedStatus(newBoard);

            // Insert into bar logic
            let newBar = [...prev.collectionBar];
            // Find index of same symbol to group visually
            const sameSymbolIndex = newBar.findIndex(t => t.symbol === clickedTile.symbol);
            if (sameSymbolIndex !== -1) {
                // Insert after the last occurrence
                const lastIndex = newBar.map(t => t.symbol).lastIndexOf(clickedTile.symbol);
                newBar.splice(lastIndex + 1, 0, clickedTile);
            } else {
                newBar.push(clickedTile);
            }

            // 2. Check for Match-3
            const counts: { [key: string]: number } = {};
            newBar.forEach(t => counts[t.symbol] = (counts[t.symbol] || 0) + 1);

            let matchedSymbol: string | null = null;
            for (const sym in counts) {
                if (counts[sym] >= 3) {
                    matchedSymbol = sym;
                    break;
                }
            }

            let finalBar = newBar;
            let scoreAdd = 0;

            if (matchedSymbol) {
                finalBar = newBar.filter(t => t.symbol !== matchedSymbol);
                scoreAdd = 30; // 3 tiles * 10
            }

            // 3. Game Over / Victory Check
            let gameOver = false;
            let victory = false;

            if (finalBar.length >= 7) {
                gameOver = true;
            }

            if (updatedBoard.length === 0 && finalBar.length === 0) {
                victory = true;
            }

            return {
                ...prev,
                board: updatedBoard,
                collectionBar: finalBar,
                player: { ...prev.player, score: prev.player.score + scoreAdd },
                isGameOver: gameOver,
                isVictory: victory
            };
        });
    }, [gameState.isGameOver, gameState.isVictory, gameState.collectionBar.length, gameState]);

    return {
        gameState,
        restartGame,
        nextLevel,
        handleTileClick,
        undoMove,
        canUndo: history.length > 0
    };
};
