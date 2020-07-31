import { createSelector } from '@ngrx/store';
import { AppState } from 'src/store';
import { IPuzzlesState, IPuzzle } from 'src/store/puzzle/types';
import * as fromPuzzle from 'src/store/puzzle/reducers/puzzle.reducer';

export const selectFeature = (state: AppState): IPuzzlesState => {
    return state[fromPuzzle.featureKey];
}

export const selectActivePuzzle = createSelector(
    selectFeature,
    (state: IPuzzlesState) => state.puzzles[state.activePuzzleId]
)

// This is if it's possible to toggle guess mode for the selected cell.
// It's only possible if we have a cell selected, and it has 0 or 1 numbers in it.
export const selectCanToggleGuessMode = createSelector(
    selectActivePuzzle,
    (puzzle: IPuzzle) => {
        if (!puzzle || !puzzle.selectedCell) return false;

        // Look up the cell and check it.
        const { row, col } = puzzle.selectedCell;
        const cell = puzzle.rows[row][col];

        // By definition, if the cell isn't in guess mode, then it has 1 or 0 numbers.
        if (!cell.isGuessMode) return true;

        // The cell is in guess mode, see how many numbers it has.
        const numGuesses = cell.guesses.reduce((acc, cur) => {
            return acc + (cur ? 1 : 0);
        }, 0);

        return numGuesses <= 1;
    }
)
