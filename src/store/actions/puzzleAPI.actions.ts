import { createAction, props } from '@ngrx/store';

export const loadPuzzle = createAction(
    '[Puzzle API] Load Puzzle',
    props<{puzzleId: string }>()
);
export const loadPuzzleSuccess = createAction('[Puzzle] Load Puzzle Success');
