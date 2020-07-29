import { createAction, props } from '@ngrx/store';
import { PuzzleColor } from 'src/enums/PuzzleColor';

export const CLEAR_CELL = '[Puzzle] Clear Cell';

interface ClearCellAction {
    type: typeof CLEAR_CELL;
    row: number,
    col: number,
}

export function clearCell(row: number, col: number): ClearCellAction {
    return {
        type: CLEAR_CELL,
        row,
        col,
    };
}

export type PuzzleActionType = ClearCellAction;

//
// export const deselectCells = createAction('[Puzzle] Deselect Cells');
// export const selectCell = createAction(
//     '[Puzzle] Select Cell',
//     props<{row: number, col: number}>()
// );
// export const setGuessColor = createAction(
//     '[Puzzle] Set Guess Color',
//     props<{color: PuzzleColor}>()
// );
// export const showAllOfNum = createAction(
//     '[Puzzle] Show All Of Num',
//     props<{num: number}>()
// );
// export const toggleNumForSelection = createAction(
//     '[Puzzle] Toggle Num For Selection',
//     props<{num: number}>()
// );
// export const win = createAction('[Puzzle] Win');
