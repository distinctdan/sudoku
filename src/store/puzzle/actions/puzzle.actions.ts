import { createAction, props, union } from '@ngrx/store';
import { PuzzleColor } from 'src/enums/PuzzleColor';

export const clearCell = createAction(
    '[Puzzle] Clear Cell',
    props<{row: number, col: number}>()
);
export const deselectCells = createAction(
    '[Puzzle] Deselect Cells'
)
export const selectCell = createAction(
    '[Puzzle] Select Cell',
    props<{row: number, col: number}>()
);
export const setActivePuzzle = createAction(
    '[Puzzle] Set Active Puzzle',
    props<{puzzleId: string}>()
);
export const setGuessColor = createAction(
    '[Puzzle] Set Guess Color',
    props<{color: PuzzleColor}>()
);
export const toggleGuessMode = createAction(
    '[Puzzle] Toggle Guess Mode',
    props<{row: number, col: number}>()
);
export const toggleNum = createAction(
    '[Puzzle] Toggle Num',
    props<{row: number, col: number, num: number}>()
);
export const toggleShowAllOfNum = createAction(
    '[Puzzle] Toggle Show All of Num',
    props<{num: number}>()
);

// A union type is needed to get type safety in reducers.
const actions = union({
    clearCell,
    deselectCells,
    selectCell,
    setActivePuzzle,
    setGuessColor,
    toggleGuessMode,
    toggleNum,
    toggleShowAllOfNum,
})
export type Actions = typeof actions;
