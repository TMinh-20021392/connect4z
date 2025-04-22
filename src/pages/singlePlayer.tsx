import React, { useEffect } from 'react';
import { Box, Button, Text } from 'zmp-ui';
import GameBoard from '../components/gameBoard';
import { useGame } from '../contexts/gameContext';

const SinglePlayer: React.FC = () => {
  const { gameState, resetGame, setGameMode } = useGame();
  const { isGameOver, winner, isDraw, humanPlayerNumber } = gameState;
  
  // Set game mode on component mount
  useEffect(() => {
    setGameMode('single');
  }, [setGameMode]);
  
  const getGameResult = () => {
    if (!isGameOver) return null;
    
    if (isDraw) {
      return "It's a draw!";
    }
    
    if (winner === humanPlayerNumber) {
      return "You win! Congratulations!";
    } else {
      return "AI wins! Better luck next time.";
    }
  };
  
  const getPlayerInfo = () => {
    if (humanPlayerNumber === 1) {
      return "You are playing as Red (Player 1)";
    } else {
      return "You are playing as Yellow (Player 2)";
    }
  };
  
  return (
    <Box className="flex flex-col items-center p-4">
      <Text size="xLarge" className="font-bold mb-2">Single Player Mode</Text>
      <Text className="mb-4">{getPlayerInfo()}</Text>
      
      <Box className="board mb-6">
        <GameBoard data-testid="game-board" />
      </Box>
      
      {isGameOver && (
        <Box className="text-center mb-6">
          <Text size="large" className="font-bold">{getGameResult()}</Text>
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