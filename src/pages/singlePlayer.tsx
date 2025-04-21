import React, { useState, useEffect } from 'react';
import { Box, Button, Text } from 'zmp-ui';
import GameState from '../components/gameState';

const SinglePlayer: React.FC = () => {
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [aiStarts, setAiStarts] = useState<boolean>(false);
  
  // Handle player turn end
  const handleTurnEnd = (currentPlayer: 1 | 2) => {
    // If it's AI's turn, trigger the AI move
    if ((aiStarts && currentPlayer === 1) || (!aiStarts && currentPlayer === 2)) {
      // Delay AI move to make it feel more natural
      setTimeout(() => {
        // Get the game state component directly by data-testid
        const gameStateElement = document.querySelector('[data-testid="game-state"]');
        if (gameStateElement) {
          const aiMoveEvent = new CustomEvent('ai-make-move');
          gameStateElement.dispatchEvent(aiMoveEvent);
        }
      }, 500);
    }
  };
  
  // Setup initial game state and handle AI first move
  useEffect(() => {
    // Clear any previous result when game resets
    setGameResult(null);
    
    // If AI starts, trigger AI move after a slight delay
    if (aiStarts) {
      setTimeout(() => {
        const gameStateElement = document.querySelector('[data-testid="game-state"]');
        if (gameStateElement) {
          const aiMoveEvent = new CustomEvent('ai-make-move');
          gameStateElement.dispatchEvent(aiMoveEvent);
        }
      }, 800); // Slightly longer delay for initial move
    }
  }, [resetTrigger, aiStarts]);
  
  // Handle game end
  const handleGameEnd = (winner: 1 | 2 | null) => {
    let resultMessage;
    
    if (winner === null) {
      resultMessage = "It's a draw!";
    } else {
      // Determine winner based on who started
      const humanWon = (aiStarts && winner === 2) || (!aiStarts && winner === 1);
      resultMessage = humanWon ? "You win! Congratulations!" : "AI wins! Better luck next time.";
    }
    
    setGameResult(resultMessage);
  };
  
  // Reset the game
  const resetGame = () => {
    // Clear the result before changing who starts first
    setGameResult(null);
    // Increment reset trigger to force board reset
    setResetTrigger(prev => prev + 1);
    // Change who starts first
    setAiStarts(prev => !prev);
  };
  
  return (
    <Box className="flex flex-col items-center p-4">
      <Text size="xLarge" className="font-bold mb-6">Single Player Mode</Text>
      
      <Text className="mb-4">
        {aiStarts ? "AI goes first (Yellow)" : "You go first (Red)"}
      </Text>
      
      <Box className="board mb-6">
        <GameState 
          onGameEnd={handleGameEnd}
          onTurnEnd={handleTurnEnd} 
          resetTrigger={resetTrigger}
          aiPlayer={aiStarts ? 1 : 2}
          data-testid="game-state"
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