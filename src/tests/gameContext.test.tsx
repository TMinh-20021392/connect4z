import { renderHook, act } from '@testing-library/react';
import { GameProvider, useGame, GameState } from '../contexts/gameContext';

describe('GameContext', () => {
    it('should initialize with the correct default state', () => {
        const { result } = renderHook(() => useGame(), { wrapper: GameProvider });

        expect(result.current.gameState.board).toHaveLength(6);
        expect(result.current.gameState.board[0]).toHaveLength(7);
        expect(result.current.gameState.currentPlayer).toBe(1);
        expect(result.current.gameState.isGameOver).toBe(false);
        expect(result.current.gameState.isDraw).toBe(false);
        expect(result.current.gameMode).toBe('single');
    });

    it('should allow making a move and switch players', () => {
        const { result } = renderHook(() => useGame(), { wrapper: GameProvider });

        act(() => {
            result.current.makeMove(0);
        });

        expect(result.current.gameState.board[5][0]).toBe(1);
        expect(result.current.gameState.currentPlayer).toBe(2);
    });

    it('should not allow moves in a full column', () => {
        const { result } = renderHook(() => useGame(), { wrapper: GameProvider });

        act(() => {
            for (let i = 0; i < 6; i++) {
                result.current.makeMove(0);
            }
        });

        act(() => {
            result.current.makeMove(0);
        });

        expect(result.current.gameState.board[0][0]).toBe(2);
        expect(result.current.gameState.currentPlayer).toBe(1);
    });

    it('should detect a win condition', () => {
        const { result } = renderHook(() => useGame(), { wrapper: GameProvider });

        act(() => {
            result.current.makeMove(0);
            result.current.makeMove(1);
            result.current.makeMove(0);
            result.current.makeMove(1);
            result.current.makeMove(0);
            result.current.makeMove(1);
            result.current.makeMove(0);
        });

        expect(result.current.gameState.winner).toBe(1);
        expect(result.current.gameState.isGameOver).toBe(true);
    });

    it('should detect a draw condition', () => {
        const { result } = renderHook(() => useGame(), { wrapper: GameProvider });

        act(() => {
            // Fill the board with alternating moves to create a draw
            for (let col = 0; col < 7; col++) {
                for (let row = 0; row < 6; row++) {
                    result.current.makeMove(col);
                }
            }
        });

        expect(result.current.gameState.isDraw).toBe(true);
        expect(result.current.gameState.isGameOver).toBe(true);
    });

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
    });
});