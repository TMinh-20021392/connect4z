import { renderHook, act } from '@testing-library/react';
import { GameProvider, useGame, GameState, Player } from '../contexts/gameContext';

describe('GameContext', () => {
    // Helper function to make multiple moves
    const makeMoves = (result: any, moves: number[]) => {
        moves.forEach(col => {
            act(() => {
                result.current.makeMove(col);
            });
        });
    };

    // Helper to create a board with specific moves
    const setupTestBoard = (moves: number[]) => {
        const { result } = renderHook(() => useGame(), { wrapper: GameProvider });
        makeMoves(result, moves);
        return result;
    };

    describe('Initialization', () => {
        it('should initialize with the correct default state', () => {
            const { result } = renderHook(() => useGame(), { wrapper: GameProvider });
    
            expect(result.current.gameState.board).toHaveLength(6);
            expect(result.current.gameState.board[0]).toHaveLength(7);
            expect(result.current.gameState.currentPlayer).toBe(1);
            expect(result.current.gameState.isGameOver).toBe(false);
            expect(result.current.gameState.isDraw).toBe(false);
            expect(result.current.gameState.isAIThinking).toBe(false);
            expect(result.current.gameState.turnCount).toBe(0);
            expect(result.current.gameState.humanPlayerNumber).toBe(1);
            expect(result.current.gameMode).toBe('single');
        });
    });

    describe('Game mechanics', () => {
        it('should allow making a move and switch players', () => {
            const { result } = renderHook(() => useGame(), { wrapper: GameProvider });
    
            act(() => {
                result.current.makeMove(0);
            });
    
            expect(result.current.gameState.board[5][0]).toBe(1);
            expect(result.current.gameState.currentPlayer).toBe(2);
            expect(result.current.gameState.turnCount).toBe(1);
        });
    
        it('should not allow moves in a full column', () => {
            const { result } = renderHook(() => useGame(), { wrapper: GameProvider });
    
            // Fill column 0
            act(() => {
                for (let i = 0; i < 6; i++) {
                    result.current.makeMove(0);
                }
            });
    
            const previousBoard = JSON.parse(JSON.stringify(result.current.gameState.board));
            const previousPlayer = result.current.gameState.currentPlayer;
    
            // Try to make one more move in column 0
            act(() => {
                result.current.makeMove(0);
            });
    
            // Verify board unchanged and player still the same
            expect(result.current.gameState.board).toEqual(previousBoard);
            expect(result.current.gameState.currentPlayer).toBe(previousPlayer);
        });

        it('should ignore moves when game is over', () => {
            const result = setupTestBoard([0, 1, 0, 1, 0, 1, 0]); // Player 1 wins
            
            const previousBoard = JSON.parse(JSON.stringify(result.current.gameState.board));
            
            // Try to make a move after game is over
            act(() => {
                result.current.makeMove(3);
            });
            
            // Verify board unchanged
            expect(result.current.gameState.board).toEqual(previousBoard);
        });

        it('should increment turn count with each move', () => {
            const { result } = renderHook(() => useGame(), { wrapper: GameProvider });
            
            expect(result.current.gameState.turnCount).toBe(0);
            
            act(() => {
                result.current.makeMove(0);
            });
            expect(result.current.gameState.turnCount).toBe(1);
            
            act(() => {
                result.current.makeMove(1);
            });
            expect(result.current.gameState.turnCount).toBe(2);
        });

        it('should update humanPlayerNumber on reset in single player mode', () => {
            const { result } = renderHook(() => useGame(), { wrapper: GameProvider });
            
            // Set to single player mode
            act(() => {
                result.current.setGameMode('single');
            });
            
            // Make winning moves for player 1
            makeMoves(result, [0, 1, 0, 1, 0, 1, 0]);
            
            expect(result.current.gameState.isGameOver).toBe(true);
            expect(result.current.gameState.winner).toBe(1);
            expect(result.current.gameState.humanPlayerNumber).toBe(1);
            
            // Reset game should alternate first player
            act(() => {
                result.current.resetGame();
            });
            
            // Human should now be player 2
            expect(result.current.gameState.humanPlayerNumber).toBe(2);
            expect(result.current.gameState.isGameOver).toBe(false);
        });
    });

    describe('Win detection', () => {
        it('should detect a vertical win', () => {
            const result = setupTestBoard([0, 1, 0, 1, 0, 1, 0]);
            
            expect(result.current.gameState.winner).toBe(1);
            expect(result.current.gameState.isGameOver).toBe(true);
        });
    
        it('should detect a horizontal win', () => {
            const result = setupTestBoard([0, 0, 1, 1, 2, 2, 3]);
            
            expect(result.current.gameState.winner).toBe(1);
            expect(result.current.gameState.isGameOver).toBe(true);
        });
    
        it('should detect a diagonal win (down-right)', () => {
            // Create a diagonal win scenario
            const result = setupTestBoard([0, 1, 1, 2, 2, 3, 2, 3, 3, 0, 3]);
            
            expect(result.current.gameState.winner).toBe(1);
            expect(result.current.gameState.isGameOver).toBe(true);
        });
    
        it('should detect a diagonal win (up-right)', () => {
            // Create an up-right diagonal win scenario
            const result = setupTestBoard([3, 2, 2, 1, 1, 0, 1, 0, 0, 3, 0]);
            
            expect(result.current.gameState.winner).toBe(1);
            expect(result.current.gameState.isGameOver).toBe(true);
        });
    
        it('should detect a draw condition', () => {
            const { result } = renderHook(() => useGame(), { wrapper: GameProvider });
            
            // Helper function to make move and avoid column overflow
            const makeMovesForColumn = (col: number, count: number) => {
                for (let i = 0; i < count && i < 6; i++) {
                    act(() => {
                        result.current.makeMove(col);
                    });
                }
            };
            
            // Fill all columns without creating a win condition
            // For example, alternating players in each column
            makeMovesForColumn(0, 6); // Fill column 0
            makeMovesForColumn(1, 6); // Fill column 1
            makeMovesForColumn(2, 6); // Fill column 2
            makeMovesForColumn(3, 6); // Fill column 3
            makeMovesForColumn(4, 6); // Fill column 4
            makeMovesForColumn(5, 6); // Fill column 5
            
            // Before filling the last column, check that we don't have a winner yet
            expect(result.current.gameState.isGameOver).toBe(false);
            expect(result.current.gameState.winner).toBeNull();
            
            // Fill the last column
            makeMovesForColumn(6, 6);
            
            // Now check for draw condition
            expect(result.current.gameState.isDraw).toBe(true);
            expect(result.current.gameState.isGameOver).toBe(true);
            expect(result.current.gameState.winner).toBeNull();
        });
    });

    describe('Game reset and mode changes', () => {
        it('should reset the game state', () => {
            const { result } = renderHook(() => useGame(), { wrapper: GameProvider });
    
            act(() => {
                result.current.makeMove(0);
                result.current.resetGame();
            });
    
            expect(result.current.gameState.board).toEqual(
                Array(6).fill(null).map(() => Array(7).fill(null))
            );
            expect(result.current.gameState.currentPlayer).toBe(1);
            expect(result.current.gameState.isGameOver).toBe(false);
            expect(result.current.gameState.turnCount).toBe(0);
        });
    
        it('should toggle game mode and reset the game', () => {
            const { result } = renderHook(() => useGame(), { wrapper: GameProvider });
    
            act(() => {
                result.current.setGameMode('two-player');
            });
    
            expect(result.current.gameMode).toBe('two-player');
            expect(result.current.gameState.board).toEqual(
                Array(6).fill(null).map(() => Array(7).fill(null))
            );
            
            act(() => {
                result.current.setGameMode('single');
            });
            
            expect(result.current.gameMode).toBe('single');
        });
    });
});