import { createSelector } from '@ngrx/store';
import { AppState } from 'src/store';
import { puzzlesFeatureKey, IPuzzlesState, IPuzzle } from 'src/store/puzzle/types';

export const selectFeature = (state: AppState): IPuzzlesState => {
    return state[puzzlesFeatureKey];
}

export const selectActivePuzzle = createSelector(
    selectFeature,
    (state: IPuzzlesState) => state.puzzles[state.activePuzzleId]
)

// This is if it's possible to toggle guess mode for the selected cell.
// It's only possible if we have a cell selected, and it has 0 or 1 numbers in it.
export const canToggleGuessMode = (puzzle: IPuzzle) => {
    if (!puzzle || !puzzle.selectedCell) return false;

    // Look up the cell and check it.
    const { row, col } = puzzle.selectedCell;
    const cell = puzzle.rows[row][col];

    if (cell.isStarterVal) return false;

    // By definition, if the cell isn't in guess mode, then it has 1 or 0 numbers.
    if (!cell.isGuessMode) return true;

    // The cell is in guess mode, see how many numbers it has.
    const numGuesses = Object.keys(cell.guesses).length;
    return numGuesses <= 1;
}
