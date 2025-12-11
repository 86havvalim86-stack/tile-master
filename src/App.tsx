import { useGameEngine } from './hooks/useGameEngine';
import { Board } from './components/Board';
import { CollectionBar } from './components/CollectionBar';
import { Scoreboard } from './components/Scoreboard';
import { RotateCcw, Undo2, Play, Trophy } from 'lucide-react';
import './App.css';

function App() {
  const { gameState, restartGame, nextLevel, handleTileClick, undoMove, canUndo } = useGameEngine();

  // Auto-start game logic removed, rely on initial state

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Tile Master 3D</h1>
        <div className="header-center">
          <span className="level-badge">LEVEL {gameState.level || 1}</span>
          <Scoreboard score={gameState.player.score} />
        </div>
      </header>

      <main className="game-area">
        {gameState.isGameOver && (
          <div className="modal-overlay">
            <div className="modal-content game-over-modal">
              <h2>Game Over!</h2>
              <p>Final Score: {gameState.player.score}</p>
              <button onClick={restartGame} className="btn-modal">Try Again</button>
            </div>
          </div>
        )}

        {gameState.isVictory && (
          <div className="modal-overlay">
            <div className="modal-content victory-modal">
              <Trophy size={48} color="#f1c40f" />
              <h2>Level Complete!</h2>
              <p>Score: {gameState.player.score}</p>
              <button onClick={nextLevel} className="btn-modal primary">
                Next Level <Play size={16} />
              </button>
            </div>
          </div>
        )}

        <div className="board-wrapper">
          <Board tiles={gameState.board} onTileClick={handleTileClick} />
        </div>

        <div className="bar-wrapper">
          <div className="controls-row">
            <button
              onClick={undoMove}
              disabled={!canUndo}
              className="btn-control left"
              title="Undo"
            >
              <Undo2 size={28} />
            </button>

            <CollectionBar tiles={gameState.collectionBar} />

            <button
              onClick={restartGame}
              className="btn-control right"
              title="Restart Level 1"
            >
              <RotateCcw size={28} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
