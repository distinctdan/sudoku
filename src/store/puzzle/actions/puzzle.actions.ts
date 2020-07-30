import { createAction, props, union } from '@ngrx/store';
import { PuzzleColor } from 'src/enums/PuzzleColor';

export const clearCell = createAction(
    '[Puzzle] Clear Cell',
    props<{row: number, col: number}>()
);
export const selectCell = createAction(
    '[Puzzle] Select Cell',
    props<{row: number, col: number}>()
);
export const setActivePuzzle = createAction(
    '[Puzzle] Set Active Puzzle',
    props<{puzzleId: string}>()
);

// A union type is needed to get type safety in reducers.
const actions = union({
    clearCell,
    selectCell,
    setActivePuzzle,
})
export type Actions = typeof actions;
