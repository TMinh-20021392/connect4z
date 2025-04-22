import React, { createContext, useContext, useState, useReducer, useEffect } from 'react';

// Define types for our game
export type Player = 1 | 2 | null;
export type BoardState = Player[][];
export type GameMode = 'single' | 'two-player';

export interface GameState {
  board: BoardState;
  currentPlayer: Player;
  winner: Player;
  isGameOver: boolean;
  isDraw: boolean;
  isAIThinking: boolean;
  turnCount: number;
  humanPlayerNumber: Player; // For single player mode: tracks if human is Player 1 or 2
}

interface GameContextType {
  gameState: GameState;
  gameMode: GameMode;
  makeMove: (col: number) => void;
  resetGame: () => void;
  setGameMode: (mode: GameMode) => void;
}

const ROWS = 6;
const COLS = 7;

// Create empty board helper
const createEmptyBoard = (): BoardState => 
  Array(ROWS).fill(null).map(() => Array(COLS).fill(null));

// Initial game state
const initialGameState: GameState = {
  board: createEmptyBoard(),
  currentPlayer: 1, // Red always starts
  winner: null,
  isGameOver: false,
  isDraw: false,
  isAIThinking: false,
  turnCount: 0,
  humanPlayerNumber: 1, // Human starts as Player 1 by default
};

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Action types for reducer
type GameAction = 
  | { type: 'MAKE_MOVE'; col: number; row: number }
  | { type: 'SET_WINNER'; winner: Player }
  | { type: 'SET_DRAW' }
  | { type: 'TOGGLE_AI_THINKING' }
  | { type: 'SWITCH_PLAYER' }
  | { type: 'RESET_GAME'; alternateFirstPlayer?: boolean };

// Game reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'MAKE_MOVE': {
      const newBoard = state.board.map(row => [...row]);
      newBoard[action.row][action.col] = state.currentPlayer;
      
      return {
        ...state,
        board: newBoard,
        turnCount: state.turnCount + 1,
      };
    }
    case 'SET_WINNER':
      return {
        ...state,
        winner: action.winner,
        isGameOver: true,
      };
    case 'SET_DRAW':
      return {
        ...state,
        isDraw: true,
        isGameOver: true,
      };
    case 'TOGGLE_AI_THINKING':
      return {
        ...state,
        isAIThinking: !state.isAIThinking,
      };
    case 'SWITCH_PLAYER':
      return {
        ...state,
        currentPlayer: state.currentPlayer === 1 ? 2 : 1,
      };
    case 'RESET_GAME': {
      // For single player mode, alternate who goes first
      const humanPlayerNumber = action.alternateFirstPlayer 
        ? (state.humanPlayerNumber === 1 ? 2 : 1)
        : state.humanPlayerNumber;
        
      return {
        ...initialGameState,
        humanPlayerNumber,
      };
    }
    default:
      return state;
  }
}

// Provider component
export const GameProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [gameMode, setGameMode] = useState<GameMode>('single');
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  
  // Get the next empty row in a column
  const getNextEmptyRow = (board: BoardState, col: number): number => {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (board[row][col] === null) {
        return row;
      }
    }
    return -1; // Column is full
  };
  
  // Check for a winner - FIXED ALGORITHM
  const checkForWinner = (board: BoardState, row: number, col: number, player: Player): boolean => {
    if (player === null) return false;
    
    // Horizontal check
    let count = 0;
    for (let c = 0; c < COLS; c++) {
      if (board[row][c] === player) {
        count++;
        if (count >= 4) return true;
      } else {
        count = 0;
      }
    }
    
    // Vertical check
    count = 0;
    for (let r = 0; r < ROWS; r++) {
      if (board[r][col] === player) {
        count++;
        if (count >= 4) return true;
      } else {
        count = 0;
      }
    }
    
    // Diagonal (down-right) check - FIXED
    for (let r = 0; r <= ROWS - 4; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (
          board[r][c] === player &&
          board[r+1][c+1] === player &&
          board[r+2][c+2] === player &&
          board[r+3][c+3] === player
        ) {
          return true;
        }
      }
    }
    
    // Diagonal (up-right) check - FIXED
    for (let r = 3; r < ROWS; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (
          board[r][c] === player &&
          board[r-1][c+1] === player &&
          board[r-2][c+2] === player &&
          board[r-3][c+3] === player
        ) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  // Check if the board is full (draw)
  const isBoardFull = (board: BoardState): boolean => {
    return board[0].every(cell => cell !== null);
  };
  
  // Make a move
  const makeMove = (col: number) => {
    // Ignore if game is over or AI is thinking
    if (gameState.isGameOver || gameState.isAIThinking) return;
    
    // In single player mode, if it's AI's turn, ignore human clicks
    if (gameMode === 'single' && gameState.currentPlayer !== gameState.humanPlayerNumber) return;
    
    const row = getNextEmptyRow(gameState.board, col);
    if (row === -1) return; // Column is full
    
    // Make the move
    dispatch({ type: 'MAKE_MOVE', col, row });
    
    // Create a new board with the move to check win conditions
    const newBoard = gameState.board.map(r => [...r]);
    newBoard[row][col] = gameState.currentPlayer;
    
    // Check if this move resulted in a win
    if (checkForWinner(newBoard, row, col, gameState.currentPlayer)) {
      dispatch({ type: 'SET_WINNER', winner: gameState.currentPlayer });
      return;
    }
    
    // Check for draw
    if (isBoardFull(newBoard)) {
      dispatch({ type: 'SET_DRAW' });
      return;
    }
    
    // Switch player
    dispatch({ type: 'SWITCH_PLAYER' });
  };
  
  // Handle AI move
  useEffect(() => {
    // Only trigger in single player mode, when it's AI's turn, and game isn't over
    if (
      gameMode === 'single' && 
      !gameState.isGameOver && 
      gameState.currentPlayer !== gameState.humanPlayerNumber &&
      !gameState.isAIThinking
    ) {
      // Set AI thinking flag
      dispatch({ type: 'TOGGLE_AI_THINKING' });
      
      const aiMoveTimeout = setTimeout(() => {
        try {
          // Get AI move
          const aiMove = getBestMove(gameState.board, gameState.currentPlayer);
          if (aiMove !== null) {
            const row = getNextEmptyRow(gameState.board, aiMove);
            
            if (row !== -1) {
              // Create a temporary board to check win condition
              const tempBoard = gameState.board.map(r => [...r]);
              tempBoard[row][aiMove] = gameState.currentPlayer;
              
              // Make AI move
              dispatch({ type: 'MAKE_MOVE', col: aiMove, row });
              
              // Check if AI won
              if (checkForWinner(tempBoard, row, aiMove, gameState.currentPlayer)) {
                dispatch({ type: 'SET_WINNER', winner: gameState.currentPlayer });
              } 
              // Check for draw
              else if (isBoardFull(tempBoard)) {
                dispatch({ type: 'SET_DRAW' });
              } 
              // Switch to human player
              else {
                dispatch({ type: 'SWITCH_PLAYER' });
              }
            }
          }
        } finally {
          // Always toggle AI thinking off
          dispatch({ type: 'TOGGLE_AI_THINKING' });
        }
      }, 0); // AI "thinking" time
      
      return () => clearTimeout(aiMoveTimeout);
    }
  }, [gameState.currentPlayer, gameState.isGameOver, gameState.humanPlayerNumber, gameMode, gameState.isAIThinking, gameState.board]);
  
  // AI logic - Find available columns
  const findAvailableColumns = (board: BoardState): number[] => {
    const availableCols: number[] = [];
    
    for (let c = 0; c < COLS; c++) {
      if (board[0][c] === null) {
        availableCols.push(c);
      }
    }
    
    return availableCols;
  };
  
  // AI logic - Get best move
  const getBestMove = (board: BoardState, player: Player): number | null => {
    if (player === null) return null;
    
    const availableCols = findAvailableColumns(board);
    if (availableCols.length === 0) return null;
    
    const opponent = player === 1 ? 2 : 1;
    
    // First check if AI can win in one move
    for (const col of availableCols) {
      const row = getNextEmptyRow(board, col);
      if (row !== -1) {
        const tempBoard = board.map(r => [...r]);
        tempBoard[row][col] = player;
        if (checkForWinner(tempBoard, row, col, player)) {
          return col; // Winning move found
        }
      }
    }
    
    // Check if opponent can win in one move (and block)
    for (const col of availableCols) {
      const row = getNextEmptyRow(board, col);
      if (row !== -1) {
        const tempBoard = board.map(r => [...r]);
        tempBoard[row][col] = opponent;
        if (checkForWinner(tempBoard, row, col, opponent)) {
          return col; // Blocking move found
        }
      }
    }
    
    // Prefer the center column
    if (availableCols.includes(3)) {
      return 3;
    }
    
    // Otherwise, choose a random column from available ones
    return availableCols[Math.floor(Math.random() * availableCols.length)];
  };
  
  // Reset game function
  const resetGame = () => {
    // In single player mode, alternate who goes first on reset
    const alternateFirstPlayer = gameMode === 'single' && gameState.isGameOver;
    dispatch({ type: 'RESET_GAME', alternateFirstPlayer });
  };
  
  return (
    <GameContext.Provider value={{ 
      gameState, 
      gameMode, 
      makeMove, 
      resetGame, 
      setGameMode 
    }}>
      {children}
    </GameContext.Provider>
  );
};

// Hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};