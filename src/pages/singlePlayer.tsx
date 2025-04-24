import React, { useEffect } from 'react';
import { Box, Button, Text, useNavigate } from 'zmp-ui';
import GameBoard from '../components/gameBoard';
import { useGame } from '../contexts/gameContext';

const SinglePlayer: React.FC = () => {
  const { gameState, resetGame, setGameMode } = useGame();
  const { isGameOver, winner, isDraw, humanPlayerNumber } = gameState;
  const navigate = useNavigate();
  
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
  
  const returnToMenu = () => {
    resetGame();
    navigate('/');
  };
  
  return (
    <Box className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Top spacer for vertical centering */}
      <Box className="flex-grow" />
      
      {/* Game content - will be centered vertically */}
      <Box className="flex flex-col items-center">
        <Text size="xLarge" className="font-bold text-center">Single Player Mode</Text>
        <Text className="mb-1">{getPlayerInfo()}</Text>
        
        <Box>
          <GameBoard data-testid="game-board" />
        </Box>
      </Box>
      
      {/* Game over section */}
      {isGameOver && (
        <Box className="text-center mt-6">
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
      
      {/* Return button when game is active */}
      {!isGameOver && (
        <Box className="text-center mt-6">
          <Button 
            variant="secondary"
            onClick={returnToMenu}
          >
            Return to Menu
          </Button>
        </Box>
      )}
      
      {/* Bottom spacer for vertical centering */}
      <Box className="flex-grow" />
    </Box>
  );
};

export default SinglePlayer;