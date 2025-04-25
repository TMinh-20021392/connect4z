import React, { useEffect } from 'react';
import { Box } from 'zmp-ui';
import GameBoard from '../components/gameBoard';
import { useGame } from '../contexts/gameContext';
import PageLayout from '../components/pageLayout';
import GameStatus from '../components/gameStatus';

const TwoPlayer: React.FC = () => {
  const { gameState, resetGame, setGameMode } = useGame();
  const { isGameOver, winner, isDraw } = gameState;
  
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
  
  return (
    <PageLayout title="Two Player Mode">
      <Box>
        <GameBoard data-testid="game-board" />
      </Box>
      
      <GameStatus 
        isGameOver={isGameOver}
        resultMessage={getGameResult()}
        resetGame={resetGame}
      />
    </PageLayout>
  );
};

export default TwoPlayer;