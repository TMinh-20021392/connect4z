import React, { useState, useEffect } from 'react';
import { Box, Button, Text } from 'zmp-ui';
import GameState from '../components/gameState';

const SinglePlayer: React.FC = () => {
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [aiTurn, setAiTurn] = useState<boolean>(false);
  
  // Handle AI turn
  useEffect(() => {
    if (aiTurn && !gameResult) {
      // Simple timeout to simulate AI "thinking"
      const aiTimeout = setTimeout(() => {
        // AI makes a random move by simulating a click on a column
        const aiMoveEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        });
        
        // Get all column cells that are available (have at least one empty cell)
        const boardElement = document.querySelector('.board');
        if (boardElement) {
          const topRow = boardElement.querySelectorAll('.flex:first-child > .cursor-pointer');
          const availableCols = Array.from(topRow).filter(col => {
            return col.querySelector('.bg-red-500, .bg-yellow-400') === null;
          });
          
          if (availableCols.length > 0) {
            // Choose random column from available ones
            const randomCol = availableCols[Math.floor(Math.random() * availableCols.length)];
            randomCol.dispatchEvent(aiMoveEvent);
          }
        }
        
        setAiTurn(false);
      }, 1000);
      
      return () => clearTimeout(aiTimeout);
    }
    return undefined;
  }, [aiTurn, gameResult]);
  
  // Handle when a player's turn ends
  const handleTurnEnd = (player: 1 | 2 | null) => {
    if (player === 1) {
      // After player 1's turn, it's AI's turn
      setAiTurn(true);
    }
  };
  
  // Handle game end
  const handleGameEnd = (winner: 1 | 2 | null) => {
    if (winner === 1) {
      setGameResult("You win! Congratulations!");
    } else if (winner === 2) {
      setGameResult("AI wins! Better luck next time.");
    } else {
      setGameResult("It's a draw!");
    }
  };
  
  // Reset the game
  const resetGame = () => {
    setResetTrigger(prev => prev + 1);
    setGameResult(null);
  };
  
  return (
    <Box className="flex flex-col items-center p-4">
      <Text size="xLarge" className="font-bold mb-6">Single Player Mode</Text>
      
      <Box className="board mb-6">
        <GameState 
          onGameEnd={handleGameEnd} 
          resetTrigger={resetTrigger} 
        />
      </Box>
      
      {gameResult && (
        <Box className="text-center mb-6">
          <Text size="large" className="font-bold">{gameResult}</Text>
          <Button 
            variant="primary"
            className="mt-4"
            onClick={resetGame}
          >
            Play Again
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SinglePlayer;