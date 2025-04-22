import React, { useEffect } from 'react';
import { Box, Button, Text, useNavigate } from 'zmp-ui';
import GameBoard from '../components/gameBoard';
import { useGame } from '../contexts/gameContext';

const TwoPlayer: React.FC = () => {
  const { gameState, resetGame, setGameMode } = useGame();
  const { isGameOver, winner, isDraw } = gameState;
  const navigate = useNavigate();
  
  // Set game mode on component mount
  useEffect(() => {
    setGameMode('two-player');
  }, [setGameMode]);
  
  const getGameResult = () => {
    if (!isGameOver) return null;
    
    if (isDraw) {
      return "It's a draw!";
    }
    
    return `Player ${winner} wins!`;
  };
  
  const returnToMenu = () => {
    navigate('/');
  };
  
  return (
    <Box className="flex flex-col items-center p-4">
      <Text size="xLarge" className="font-bold mb-6">Two Player Mode</Text>
      
      <Box className="board mb-6">
        <GameBoard data-testid="game-board" />
      </Box>
      
      {isGameOver && (
        <Box className="text-center mb-6">
          <Text size="large" className="font-bold mb-4">{getGameResult()}</Text>
          <Box className="flex flex-col gap-2">
            <Button 
              variant="primary"
              onClick={resetGame}
            >
              Play Again
            </Button>
            <Button 
              variant="secondary"
              onClick={returnToMenu}
            >
              Return to Menu
            </Button>
          </Box>
        </Box>
      )}
      
      {!isGameOver && (
        <Box className="text-center mb-6 mt-4">
          <Button 
            variant="secondary"
            onClick={returnToMenu}
          >
            Return to Menu
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TwoPlayer;