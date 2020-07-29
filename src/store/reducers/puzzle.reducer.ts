import { Action, createReducer, on } from '@ngrx/store';
import * as PuzzleActions from '../actions/puzzle.actions';
import { PuzzleColor } from "../../enums/PuzzleColor";
import { cloneDeep } from 'lodash';

export interface IPuzzleCell {
    num: number | undefined;
    isError?: boolean;
    isGuessMode?: boolean;
    isSelected?: boolean;
    isStarterVal: boolean;
    // 1-based array of 10 items. We're ignoring the 0th slot.
    // So if the user guess "1", we'll set a guess object at index[1];
    guesses: Array<{
        color: PuzzleColor;
    }>;
}

export interface IPuzzle {
    hasWon?: boolean;
    id: string,
    rows: IPuzzleCell[][],
    selectedCell: {row: number, col: number};
    showingAllNum: number;
}

export interface IPuzzlesState {
    puzzles: {[id: string]: IPuzzle};
    activePuzzleId: string;
}

export const initialState: IPuzzlesState = {
    puzzles: {},
    activePuzzleId: undefined,
}

// Helper function, returns true if the cell has an error
function markPuzzleErrors_checkCell(existingNums: boolean[], cell: IPuzzleCell): boolean {
    if (cell.num) {
        if (existingNums[cell.num]) {
            cell.isError = true;
            return true;
        } else {
            existingNums[cell.num] = true;
        }
    }

    return false;
}

// Returns number of errors found
function markPuzzleErrors(puzzle: IPuzzle): number {
    let errorCount = 0;

    // First clear all errors
    for (const row of puzzle.rows) {
        for (const cell of row) {
            cell.isError = false;
        }
    }

    // It's an error if the same number is in row, columns, or group.
    // Check rows
    for (const row of puzzle.rows) {
        // Keep track of duplicates per row.
        const existingNums = new Array(9);

        for (const cell of row) {
            const hasError = markPuzzleErrors_checkCell(existingNums, cell);
            if (hasError) errorCount++;
        }
    }

    // Check columns.
    for (let colI = 0; colI < 9; colI++) {
        const existingNums = new Array(9);

        for (let rowI = 0; rowI < 9; rowI++) {
            const cell = puzzle.rows[rowI][colI];
            const hasError = markPuzzleErrors_checkCell(existingNums, cell);
            if (hasError) errorCount++;
        }
    }

    // Check groups of 9
    for (let groupRowI = 0; groupRowI < 9; groupRowI += 3) {
        for (let groupColI = 0; groupColI < 9; groupColI += 3) {
            const existingNums = new Array(9);

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const cell = puzzle.rows[groupRowI + i][groupColI + j];
                    const hasError = markPuzzleErrors_checkCell(existingNums, cell);
                    if (hasError) errorCount++;
                }
            }
        }
    }

    return errorCount;
}

export function puzzleReducer(
    state: IPuzzlesState = initialState,
    action: PuzzleActions.PuzzleActionType
): IPuzzlesState {
    if (!state.activePuzzleId) return state;

    // Make sure we have a puzzle loaded
    const puzzle = state.puzzles[state.activePuzzleId]
    if (!puzzle) return state;

    switch (action.type) {
        case PuzzleActions.CLEAR_CELL: {
            // Make sure it's editable before we clear it.
            if (puzzle.rows[action.row][action.col].isStarterVal) {
                return state;
            }

            const newPuzzleState: IPuzzle = cloneDeep(puzzle);
            const cell = newPuzzleState.rows[action.row][action.col];
            cell.guesses = [];
            cell.isGuessMode = false;
            cell.num = undefined;

            return {
                ...state,
                puzzles: {
                    ...state.puzzles,
                    [state.activePuzzleId]: newPuzzleState,
                }
            }
        }
        default:
            return state;
    }
}

export const puzzlesFeatureKey = 'puzzles';
