import React from 'react';
import { Trophy } from 'lucide-react';
import './Scoreboard.css';

interface ScoreboardProps {
    score: number;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ score }) => {
    return (
        <div className="scoreboard">
            <Trophy color="#f1c40f" size={24} />
            <span className="score-value">{score}</span>
            <span className="score-label">Points</span>
        </div>
    );
};
