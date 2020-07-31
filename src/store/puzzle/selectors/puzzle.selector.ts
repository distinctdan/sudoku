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
