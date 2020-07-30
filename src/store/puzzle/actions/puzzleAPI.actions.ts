import { createAction, props, union } from '@ngrx/store';
import { IPuzzle } from "src/store/puzzle/types";

export const loadPuzzle = createAction(
    '[Puzzle API] Load Puzzle',
    props<{puzzleId: string}>()
);
export const loadPuzzleSuccess = createAction(
    '[Puzzle API] Load Puzzle Success',
    props<{puzzle: IPuzzle}>()
);
export const loadPuzzleError = createAction(
    '[Puzzle API] Load Puzzle Error',
    props<{puzzleId: string, err: any}>()
);

const actions = union({
    loadPuzzle,
    loadPuzzleSuccess,
    loadPuzzleError,
});
export type Actions = typeof actions;
