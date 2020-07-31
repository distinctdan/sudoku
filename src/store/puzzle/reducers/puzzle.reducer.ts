import { cloneDeep } from 'lodash';

import { PuzzleActions, PuzzleAPIActions, } from 'src/store/puzzle/actions';
import { IPuzzlesState, IPuzzle, IPuzzleCell } from 'src/store/puzzle/types';
import { PuzzleColor } from 'src/enums';
import { selectCanToggleGuessMode } from 'src/store/puzzle/selectors/puzzle.selectors';

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

export function reducer(
    state: IPuzzlesState = initialState,
    action: PuzzleActions.Actions | PuzzleAPIActions.Actions
): IPuzzlesState {
    switch (action.type) {
        // ------------- API Actions -------------
        case PuzzleAPIActions.loadPuzzleSuccess.type: {
            return {
                ...state,
                puzzles: {
                    ...state.puzzles,
                    [action.puzzle.id]: action.puzzle,
                }
            }
        }
        // ------------- Puzzles Actions -------------
        case PuzzleActions.clearCell.type: {
            // Make sure we have a puzzle loaded
            if (!state.activePuzzleId) return state;
            const puzzle = state.puzzles[state.activePuzzleId]
            if (!puzzle) return state;

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
        case PuzzleActions.deselectCells.type: {
            // Make sure we have a puzzle loaded
            if (!state.activePuzzleId) return state;
            const puzzle = state.puzzles[state.activePuzzleId]
            if (!puzzle) return state;

            // If the puzzle doesn't have a cell selected, return the same state to avoid rerendering
            if (!puzzle.selectedCell) return state;

            return {
                ...state,
                puzzles: {
                    ...state.puzzles,
                    [state.activePuzzleId]: {
                        ...puzzle,
                        selectedCell: undefined,
                    }
                }
            }
        }
        case PuzzleActions.selectCell.type: {
            if (!state.activePuzzleId) return state;
            const puzzle = state.puzzles[state.activePuzzleId]
            if (!puzzle) return state;

            // Make sure we stay within our bounds
            const row = Math.max(0, Math.min(8, action.row));
            const col = Math.max(0, Math.min(8, action.col));

            return {
                ...state,
                puzzles: {
                    ...state.puzzles,
                    [state.activePuzzleId]: {
                        ...puzzle,
                        selectedCell: {
                            row,
                            col,
                        }
                    },
                }
            }
        }
        case PuzzleActions.setActivePuzzle.type:
            return {
                ...state,
                activePuzzleId: action.puzzleId,
            }
        case PuzzleActions.toggleGuessMode.type:
            if (!selectCanToggleGuessMode(state)) return state;

            const activePuzzle = state.puzzles[state.activePuzzleId];
            if (!activePuzzle || !activePuzzle.selectedCell) return state;

            const puzzle = cloneDeep(activePuzzle);
            const { row, col } = puzzle.selectedCell;
            const cell = puzzle.rows[row][col];

            if (!cell.isGuessMode) {
                cell.isGuessMode = true;

                // If the cell has a number, convert it to a guess
                if (cell.num) {
                    cell.guesses[cell.num] = {color: puzzle.guessColor};
                    cell.num = undefined;
                }
            } else {
                // Cell is already in guess mode.
                // We can only turn off guess mode if the cell has 1 or 0 numbers in it
                const numGuesses = cell.guesses.reduce((acc, cur) => {
                    return acc + (cur ? 1 : 0);
                }, 0);

                if (numGuesses === 0) {
                    cell.isGuessMode = false;
                } else if (numGuesses === 1) {
                    // Find the guess and convert it to a num.
                    cell.isGuessMode = false;
                    let num = 1;
                    // Guesses are 1-indexed, it's the first guess that isn't undefined
                    for (; num < cell.guesses.length; num++) {
                        if (cell.guesses[num]) {
                            break;
                        }
                    }
                    cell.num = num;
                    cell.guesses = [];
                }
                // Else, the cell has more than 1 guess, so we can't do anything.
            }

            return {
                ...state,
                puzzles: {
                    ...state.puzzles,
                    [state.activePuzzleId]: puzzle,
                }
            };
        default:
            return state;
    }
}

export const featureKey = 'puzzlesFeature';
