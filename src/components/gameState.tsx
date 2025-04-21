import React, { useState, useEffect, useRef } from 'react';
import { Box, Text } from 'zmp-ui';

// Define types for our game board
type Player = 1 | 2 | null;
type BoardState = Player[][];

interface GameStateProps {
  onGameEnd?: (winner: Player) => void;
  onTurnEnd?: (currentPlayer: 1 | 2) => void;
  resetTrigger?: number;
  aiPlayer?: 1 | 2;  // Which player number is the AI
  'data-testid'?: string;
}

const GameState: React.FC<GameStateProps> = ({ 
  onGameEnd, 
  onTurnEnd,
  resetTrigger = 0, 
  aiPlayer = 2,
  'data-testid': dataTestId
}) => {
  const ROWS = 6;
  const COLS = 7;
  const gameRef = useRef<HTMLDivElement>(null);
  
  // Initialize empty board
  const createEmptyBoard = (): BoardState => 
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
  
  const [board, setBoard] = useState<BoardState>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<Player>(null);
  
  // Reset the game when resetTrigger changes
  useEffect(() => {
    setBoard(createEmptyBoard());
    setCurrentPlayer(1); // Always start with player 1
    setGameOver(false);
    setWinner(null);
  }, [resetTrigger]);
  
  // AI move handler
  useEffect(() => {
    const handleAiMove = () => {
      if (gameOver) return;
      
      // Make AI move
      const availableCols = findAvailableColumns(board);
      if (availableCols.length > 0) {
        // Choose a column with basic strategy:
        // 1. If AI can win, make that move
        // 2. If player can win next turn, block that move
        // 3. Otherwise make a random move
        
        let bestCol = getBestMove(board, currentPlayer);
        dropDisc(bestCol);
      }
    };
    
    // Add event listener for AI moves
    const currentRef = gameRef.current;
    if (currentRef) {
      currentRef.addEventListener('ai-make-move', handleAiMove);
      
      return () => {
        currentRef.removeEventListener('ai-make-move', handleAiMove);
      };
    }
    
    return undefined;
  }, [board, currentPlayer, gameOver]);
  
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
  
  // Get best move for AI with basic strategy
  const getBestMove = (board: BoardState, player: 1 | 2): number => {
    const availableCols = findAvailableColumns(board);
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
  
  // Get next empty row in a column
  const getNextEmptyRow = (board: BoardState, col: number): number => {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === null) {
        return row;
      }
    }
    return -1; // Column is full
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
    
    // Check if board is full (draw)
    const isFull = board.every(row => row.every(cell => cell !== null));
    if (isFull) {
      return null; // Draw
    }
    
    return null; // No winner yet
  };
  
  // Check if there's a winner after each move
  useEffect(() => {
    const gameWinner = checkForWinner(board);
    
    if (gameWinner !== null || board.every(row => row.every(cell => cell !== null))) {
      setGameOver(true);
      setWinner(gameWinner);
      if (onGameEnd) {
        onGameEnd(gameWinner);
      }
    } else if (onTurnEnd && currentPlayer) {
      // If the game continues, notify about the turn end
      onTurnEnd(currentPlayer);
    }
  }, [board, onGameEnd, onTurnEnd, currentPlayer]);
  
  // Make a move in the selected column
  const dropDisc = (col: number) => {
    if (gameOver) return;
    
    // Find the first empty cell from bottom to top
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === null) {
        const newBoard = [...board.map(row => [...row])];
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        return;
      }
    }
  };
  
  return (
    <Box ref={gameRef as React.MutableRefObject<HTMLDivElement>} data-testid={dataTestId} className="flex flex-col items-center">
      {/* Game status */}
      <Text size="large" className="mb-4 font-bold">
        {gameOver 
          ? winner 
            ? `Player ${winner} wins!` 
            : "It's a draw!" 
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
                  // Only allow human player to click
                  if (currentPlayer !== aiPlayer) {
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