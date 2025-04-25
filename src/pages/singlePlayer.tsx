import React, { useEffect } from 'react';
import { Box, Text } from 'zmp-ui';
import GameBoard from '../components/gameBoard';
import { useGame } from '../contexts/gameContext';
import PageLayout from '../components/pageLayout';
import GameStatus from '../components/gameStatus';

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
    <PageLayout 
      title="Single Player Mode"
      subtitle={getPlayerInfo()}
    >
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

export default SinglePlayer;