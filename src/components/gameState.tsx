import React, { useState, useEffect, useRef } from 'react';
import { Box, Text } from 'zmp-ui';

// Define types for our game board
export type Player = 1 | 2 | null;
export type BoardState = Player[][];

export interface GameStateProps {
  onGameEnd?: (winner: Player) => void;
  onTurnChange?: (currentPlayer: Player) => void;
  resetTrigger?: number;
  aiPlayer?: Player | null;  // Which player number is the AI (null for 2 human players)
  aiDelay?: number; // Delay before AI makes a move in ms
  'data-testid'?: string;
}

const GameState: React.FC<GameStateProps> = ({ 
  onGameEnd, 
  onTurnChange,
  resetTrigger = 0, 
  aiPlayer = null,
  aiDelay = 5,
  'data-testid': dataTestId
}) => {
  const ROWS = 6;
  const COLS = 7;
  
  // Initialize empty board
  const createEmptyBoard = (): BoardState => 
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
  
  const [board, setBoard] = useState<BoardState>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<Player>(null);
  const [isAIThinking, setIsAIThinking] = useState<boolean>(false);
  
  // Keep track of resetTrigger changes
  const prevResetTriggerRef = useRef<number>(resetTrigger);
  
  // Reset the game when resetTrigger changes
  useEffect(() => {
    if (resetTrigger !== prevResetTriggerRef.current) {
      console.log("Resetting game board...");
      setBoard(createEmptyBoard());
      setCurrentPlayer(1); // Always start with player 1
      setGameOver(false);
      setWinner(null);
      setIsAIThinking(false);
      prevResetTriggerRef.current = resetTrigger;
    }
  }, [resetTrigger]);
  
  // Handle initial AI turn if AI is Player 1
  useEffect(() => {
    // Check if it's a fresh board (all slots are null)
    const isFreshBoard = board.every(row => row.every(cell => cell === null));
    
    // Make AI move if it's Player 1 AND the board is fresh
    if (isFreshBoard && currentPlayer === 1 && aiPlayer === 1 && !gameOver && !isAIThinking) {
      console.log("AI should make first move as Player 1");
      setIsAIThinking(true);
      
      const timeoutId = setTimeout(() => {
        const bestCol = getBestMove(board, 1);
        dropDisc(bestCol);
        setIsAIThinking(false);
      }, aiDelay);
      
      return () => clearTimeout(timeoutId);
    }
  }, [resetTrigger, board, currentPlayer, aiPlayer]);
  
  // Handle AI turn during game
  useEffect(() => {
    // Only trigger AI move when:
    // 1. Game is not over
    // 2. Current player is the AI player
    // 3. AI player is defined
    // 4. AI is not already thinking
    if (!gameOver && currentPlayer === aiPlayer && aiPlayer !== null && !isAIThinking) {
      console.log(`AI (Player ${aiPlayer}) is making a move...`);
      setIsAIThinking(true);
      
      const timeoutId = setTimeout(() => {
        const bestCol = getBestMove(board, currentPlayer);
        dropDisc(bestCol);
        setIsAIThinking(false);
      }, aiDelay);
      
      return () => clearTimeout(timeoutId);
    }
  }, [currentPlayer, gameOver, aiPlayer, board, isAIThinking]);
  
  // Notify parent about turn change
  useEffect(() => {
    if (onTurnChange && !gameOver) {
      onTurnChange(currentPlayer);
    }
  }, [currentPlayer, gameOver, onTurnChange]);
  
  // Find all available columns
  const findAvailableColumns = (board: BoardState): number[] => {
    const availableCols: number[] = [];
    
    for (let c = 0; c < COLS; c++) {
      // If the top cell is empty, the column is available
      if (board[0][c] === null) {
        availableCols.push(c);
      }
    }
    
    return availableCols;
  };
  
  // Get next empty row in a column
  const getNextEmptyRow = (board: BoardState, col: number): number => {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === null) {
        return row;
      }
    }
    return -1; // Column is full
  };
  
  // Get best move for AI with basic strategy
  const getBestMove = (board: BoardState, player: Player): number => {
    if (player === null) return 0; // Safety check
    
    const availableCols = findAvailableColumns(board);
    if (availableCols.length === 0) return -1; // No moves available
    
    const opponent = player === 1 ? 2 : 1;
    
    // First check if AI can win in one move
    for (const col of availableCols) {
      const tempBoard = board.map(row => [...row]);
      const row = getNextEmptyRow(tempBoard, col);
      if (row !== -1) {
        tempBoard[row][col] = player;
        if (checkForWinner(tempBoard) === player) {
          return col; // Winning move found
        }
      }
    }
    
    // Check if opponent can win in one move (and block)
    for (const col of availableCols) {
      const tempBoard = board.map(row => [...row]);
      const row = getNextEmptyRow(tempBoard, col);
      if (row !== -1) {
        tempBoard[row][col] = opponent;
        if (checkForWinner(tempBoard) === opponent) {
          return col; // Blocking move found
        }
      }
    }
    
    // Prefer the center column as it provides more win opportunities
    if (availableCols.includes(3)) {
      return 3;
    }
    
    // Otherwise make a random move
    return availableCols[Math.floor(Math.random() * availableCols.length)];
  };
  
  // Check for winner
  const checkForWinner = (board: BoardState): Player => {
    // Check horizontal
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (
          board[r][c] !== null &&
          board[r][c] === board[r][c + 1] &&
          board[r][c] === board[r][c + 2] &&
          board[r][c] === board[r][c + 3]
        ) {
          return board[r][c];
        }
      }
    }
    
    // Check vertical
    for (let r = 0; r <= ROWS - 4; r++) {
      for (let c = 0; c < COLS; c++) {
        if (
          board[r][c] !== null &&
          board[r][c] === board[r + 1][c] &&
          board[r][c] === board[r + 2][c] &&
          board[r][c] === board[r + 3][c]
        ) {
          return board[r][c];
        }
      }
    }
    
    // Check diagonal (down-right)
    for (let r = 0; r <= ROWS - 4; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (
          board[r][c] !== null &&
          board[r][c] === board[r + 1][c + 1] &&
          board[r][c] === board[r + 2][c + 2] &&
          board[r][c] === board[r + 3][c + 3]
        ) {
          return board[r][c];
        }
      }
    }
    
    // Check diagonal (up-right)
    for (let r = 3; r < ROWS; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (
          board[r][c] !== null &&
          board[r][c] === board[r - 1][c + 1] &&
          board[r][c] === board[r - 2][c + 2] &&
          board[r][c] === board[r - 3][c + 3]
        ) {
          return board[r][c];
        }
      }
    }
    
    // No winner found
    return null;
  };
  
  // Check if there's a winner after each move
  useEffect(() => {
    // Skip this check if we're already in a game over state
    if (gameOver) return;
    
    const gameWinner = checkForWinner(board);
    const isFull = board.every(row => row.every(cell => cell !== null));
    
    if (gameWinner !== null || isFull) {
      console.log(`Game over! Winner: ${gameWinner}`);
      setGameOver(true);
      setWinner(gameWinner);
      if (onGameEnd) {
        onGameEnd(gameWinner);
      }
    }
  }, [board, onGameEnd, gameOver]);
  
  // Make a move in the selected column
  const dropDisc = (col: number) => {
    if (gameOver || isAIThinking) return;
    
    // Find the first empty cell from bottom to top
    const row = getNextEmptyRow(board, col);
    if (row !== -1) {
      const newBoard = [...board.map(row => [...row])];
      newBoard[row][col] = currentPlayer;
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };
  
  // Check if player can make a move or if it's AI's turn
  const canMakeMove = (col: number): boolean => {
    // Column must not be full
    if (getNextEmptyRow(board, col) === -1) return false;
    
    // If it's the AI's turn, human should not make a move
    if (currentPlayer === aiPlayer) return false;
    
    // Game must not be over
    if (gameOver) return false;
    
    // Can't make moves while AI is thinking
    if (isAIThinking) return false;
    
    return true;
  };
  
  return (
    <Box data-testid={dataTestId} className="flex flex-col items-center">
      {/* Game status */}
      <Text size="large" className="mb-4 font-bold">
        {gameOver 
          ? winner 
            ? `Player ${winner} wins!` 
            : "It's a draw!" 
          : isAIThinking
            ? "AI is thinking..."
            : `Player ${currentPlayer}'s turn`}
      </Text>
      
      {/* Board */}
      <Box className="bg-blue-600 p-2 rounded-lg">
        {board.map((row, rowIndex) => (
          <Box key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <Box 
                key={`${rowIndex}-${colIndex}`}
                className="w-10 h-10 bg-blue-800 m-1 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => {
                  if (canMakeMove(colIndex)) {
                    dropDisc(colIndex);
                  }
                }}
              >
                {cell && (
                  <Box 
                    className={`w-8 h-8 rounded-full ${
                      cell === 1 ? 'bg-red-500' : 'bg-yellow-400'
                    }`}
                  />
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default GameState;