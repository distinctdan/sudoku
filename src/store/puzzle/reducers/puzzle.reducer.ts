import cloneDeep from 'lodash';

import { PuzzleActions, PuzzleAPIActions, } from 'src/store/puzzle/actions';
import { IPuzzlesState, IPuzzle, IPuzzleCell } from 'src/store/puzzle/types';
import { PuzzleColor } from 'src/enums';
import { canToggleGuessMode } from 'src/store/puzzle/selectors/puzzle.selectors';

// Returns number of errors found
function checkWin(numErrors: number, puzzle: IPuzzle): void {
    if (numErrors === 0) {
        // No errors, see if all cells are filled in.
        let count = 0;
        for (const row of puzzle.rows) {
            for (const cell of row) {
                if (cell.num) count++;
            }
        }

        if (count === 81) {
            // WIN!!!
            puzzle.hasWon = true;
            puzzle.selectedCell = undefined;
            puzzle.showingAllNum = undefined;
        }
    }
}

function markErrors(puzzle: IPuzzle): number {
    let errorCount = 0;

    // First clear all errors
    for (const row of puzzle.rows) {
        for (const cell of row) {
            cell.isError = false;
        }
    }

    // It's an error if the same number is in row, columns, or group.
    // We're doing a 2 pass algorithm:
    // - Store how many of each number is in the row/col/group
    // - Go through again and see if the count for the current number is greater than 1
    for (const row of puzzle.rows) {
        const existingNums = new Array(10).fill(0);

        for (const cell of row) {
            if (cell.num) existingNums[cell.num]++;
        }

        for (const cell of row) {
            if (cell.num && existingNums[cell.num] > 1) {
                errorCount++;
                cell.isError = true;
            }
        }
    }

    // Check columns.
    for (let colI = 0; colI < 9; colI++) {
        const existingNums = new Array(10).fill(0);

        for (let rowI = 0; rowI < 9; rowI++) {
            const cell = puzzle.rows[rowI][colI];
            if (cell.num) existingNums[cell.num]++;
        }

        for (let rowI = 0; rowI < 9; rowI++) {
            const cell = puzzle.rows[rowI][colI];
            if (cell.num && existingNums[cell.num] > 1) {
                cell.isError = true;
                errorCount++;
            }
        }
    }

    // Check groups of 9
    for (let groupRowI = 0; groupRowI < 9; groupRowI += 3) {
        for (let groupColI = 0; groupColI < 9; groupColI += 3) {
            const existingNums = new Array(10).fill(0);

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const cell = puzzle.rows[groupRowI + i][groupColI + j];
                    if (cell.num) existingNums[cell.num]++;
                }
            }

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const cell = puzzle.rows[groupRowI + i][groupColI + j];
                    if (cell.num && existingNums[cell.num] > 1) {
                        cell.isError = true;
                        errorCount++;
                    }
                }
            }
        }
    }

    return errorCount;
}

export const initialState: IPuzzlesState = {
    puzzles: {},
    activePuzzleId: undefined,
}

export function puzzlesReducer(
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
            const puzzle = state.puzzles[state.activePuzzleId]
            if (!puzzle || puzzle.hasWon || !puzzle.selectedCell) return state;

            // Make sure it's editable before we clear it.
            if (puzzle.rows[action.row][action.col].isStarterVal) {
                return state;
            }

            const newPuzzleState: IPuzzle = cloneDeep(puzzle);
            const cell = newPuzzleState.rows[action.row][action.col];
            cell.guesses = {};
            cell.isGuessMode = false;
            cell.num = undefined;

            markErrors(newPuzzleState);

            return {
                ...state,
                puzzles: {
                    ...state.puzzles,
                    [state.activePuzzleId]: newPuzzleState,
                }
            }
        }
        case PuzzleActions.deselectCells.type: {
            // Make sure we have a puzzle loaded and a cell selected
            const puzzle = state.puzzles[state.activePuzzleId]
            if (!puzzle || puzzle.hasWon) return state;

            return {
                ...state,
                puzzles: {
                    ...state.puzzles,
                    [state.activePuzzleId]: {
                        ...puzzle,
                        selectedCell: undefined,
                        showingAllNum: undefined,
                    }
                }
            };
        }
        case PuzzleActions.resetPuzzle.type: {
            const activePuzzle = state.puzzles[state.activePuzzleId]
            if (!activePuzzle) return state;

            const puzzle: IPuzzle = cloneDeep(activePuzzle);
            // Clear all cells
            for (const row of puzzle.rows) {
                for (const cell of row) {
                    if (!cell.isStarterVal) {
                        cell.num = undefined;
                        cell.isError = false;
                        cell.guesses = {};
                        cell.isGuessMode = false;
                    }
                }
            }
            puzzle.hasWon = false;
            puzzle.showingAllNum = undefined;
            puzzle.selectedCell = undefined;

            return {
                ...state,
                puzzles: {
                    ...state.puzzles,
                    [state.activePuzzleId]: puzzle,
                }
            }
        }
        case PuzzleActions.selectCell.type: {
            const puzzle = state.puzzles[state.activePuzzleId]
            if (!puzzle || puzzle.hasWon) return state;

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
                        },
                        showingAllNum: undefined,
                    },
                }
            }
        }
        case PuzzleActions.setActivePuzzle.type:
            return {
                ...state,
                activePuzzleId: action.puzzleId,
            }
        case PuzzleActions.setGuessColor.type: {
            const activePuzzle = state.puzzles[state.activePuzzleId];
            if (!activePuzzle) return state;

            return {
                ...state,
                puzzles: {
                    ...state.puzzles,
                    [state.activePuzzleId]: {
                        ...activePuzzle,
                        guessColor: action.color,
                    },
                }
            };
        }
        case PuzzleActions.toggleGuessMode.type: {
            const activePuzzle = state.puzzles[state.activePuzzleId];
            if (!activePuzzle || activePuzzle.hasWon || !canToggleGuessMode(activePuzzle)) return state;

            const puzzle: IPuzzle = cloneDeep(activePuzzle);
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
                // Cell is already in guess mode. We're guaranteed at this point
                // that the cell has 0 or 1 guesses. Find the first guess and make
                // it the main num.
                cell.isGuessMode = false;
                const guessNums = Object.keys(cell.guesses);
                if (guessNums.length > 0) {
                    cell.num = parseInt(guessNums[0], 10);
                }
                cell.guesses = {};
            }

            const numErrors = markErrors(puzzle);
            checkWin(numErrors, puzzle);

            return {
                ...state,
                puzzles: {
                    ...state.puzzles,
                    [state.activePuzzleId]: puzzle,
                }
            };
        }
        case PuzzleActions.toggleNum.type: {
            // Make sure we have a puzzle loaded and an editable cell selected
            const puzzleOrig = state.puzzles[state.activePuzzleId]
            if (!puzzleOrig || puzzleOrig.hasWon || !puzzleOrig.selectedCell) return state;

            const { row, col } = puzzleOrig.selectedCell;
            const selectedCellOrig = puzzleOrig.rows[row][col]
            if (selectedCellOrig.isStarterVal) return state;

            const num = action.num;
            const puzzle: IPuzzle = cloneDeep(puzzleOrig);
            const cell = puzzle.rows[row][col];

            if (cell.isGuessMode) {
                // If the cell doesn't have this num, add it
                if (!cell.guesses[num]) {
                    cell.guesses[num] = {color: puzzle.guessColor};
                } else {
                    // Cell already has this num, need to remove it.
                    delete cell.guesses[num];

                    // If this causes the cell to have 1 or 0 guesses, exit guess mode
                    const guessNums = Object.keys(cell.guesses);
                    if (guessNums.length === 0) {
                        cell.isGuessMode = false;
                    }
                    else if (guessNums.length === 1) {
                        cell.isGuessMode = false;
                        // Convert the remaining guess to the main num.
                        if (guessNums.length === 1) {
                            cell.num = parseInt(guessNums[0], 10);
                            cell.guesses = {};
                        }
                    }
                }
            } else {
                // Cell isn't in guess mode. If it doesn't already have a num, just set it.
                if (!cell.num) {
                    cell.num = num;
                } else {
                    if (cell.num !== num) {
                        // Cell already has a different num. Convert both into guesses
                        cell.isGuessMode = true;
                        cell.guesses = {
                            [cell.num]: {color: puzzle.guessColor},
                            [num]: {color: puzzle.guessColor},
                        }
                    }
                    // Cell already had a num, we've converted it to a guess
                    cell.num = undefined;
                }
            }

            const numErrors = markErrors(puzzle);
            checkWin(numErrors, puzzle);

            return {
                ...state,
                puzzles: {
                    ...state.puzzles,
                    [state.activePuzzleId]: puzzle,
                }
            }
        }
        case PuzzleActions.toggleShowAllOfNum.type: {
            const puzzleOrig = state.puzzles[state.activePuzzleId]
            if (!puzzleOrig || puzzleOrig.hasWon || puzzleOrig.selectedCell) return state;

            const puzzle = { ...puzzleOrig };
            if (puzzle.showingAllNum === action.num) {
                puzzle.showingAllNum = undefined;
            } else {
                puzzle.showingAllNum = action.num;
            }

            return {
                ...state,
                puzzles: {
                    ...state.puzzles,
                    [state.activePuzzleId]: puzzle,
                }
            }
        }
        default:
            return state;
    }
}
