import React, { useEffect } from 'react';
import { Box, Button, Text } from 'zmp-ui';
import GameBoard from '../components/gameBoard';
import { useGame } from '../contexts/gameContext';

const TwoPlayer: React.FC = () => {
  const { gameState, resetGame, setGameMode } = useGame();
  const { isGameOver } = gameState;
  
  // Set game mode on component mount
  useEffect(() => {
    setGameMode('two-player');
  }, [setGameMode]);
  
  return (
    <Box className="flex flex-col items-center p-4">
      <Text size="xLarge" className="font-bold mb-6">Two Player Mode</Text>
      
      <Box className="board mb-6">
        <GameBoard data-testid="game-board" />
      </Box>
      
      {isGameOver && (
        <Box className="text-center mb-6">
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

export default TwoPlayer;