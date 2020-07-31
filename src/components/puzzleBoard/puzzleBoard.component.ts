import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { IPuzzle, IPuzzleCell } from 'src/store/puzzle';
import { PuzzleActions } from 'src/store/puzzle';
import { KeyCode } from 'src/enums';

@Component({
    selector: 'puzzle-board',
    templateUrl: './puzzleBoard.component.html',
    styleUrls: ['./puzzleBoard.component.scss']
})
export class PuzzleBoardComponent {
    @Input() board: IPuzzle;

    constructor(private store: Store) {

    }

    public isCellSelected(cell: IPuzzleCell): boolean {
        const selectedCell = this.board && this.board.selectedCell;
        return selectedCell
            && cell.row === selectedCell.row
            && cell.col === selectedCell.col;
    }

    public isCellRowColSelected(cell: IPuzzleCell): boolean {
        const selectedCell = this.board && this.board.selectedCell;
        return selectedCell && (
            cell.row === selectedCell.row
            || cell.col === selectedCell.col
        )
    }

    public onBlur = () => {
        this.store.dispatch(PuzzleActions.deselectCells());
    }

    public onCellClick = ($e: MouseEvent, cell: IPuzzleCell) => {
        this.store.dispatch(PuzzleActions.selectCell({
            row: cell.row,
            col: cell.col
        }));
    }

    public onKeyDown = ($e: KeyboardEvent) => {
        if ($e.defaultPrevented) return;

        console.log('keyCode: ', $e.keyCode);
        let handled = true;
        // Using keyCode because key isn't supported by older browsers,
        // and key has different values on edge.
        switch($e.keyCode) {
            case KeyCode.LeftArrow:
                this.keyboardMoveCell(-1, 0);
                break;
            case KeyCode.RightArrow:
                this.keyboardMoveCell(1, 0);
                break;
            case KeyCode.UpArrow:
                this.keyboardMoveCell(0, -1);
                break;
            case KeyCode.DownArrow:
                this.keyboardMoveCell(0, 1);
                break;
            case KeyCode.Backspace:
            case KeyCode.Delete:
                if (this.board && this.board.selectedCell) {
                    this.store.dispatch(PuzzleActions.clearCell(this.board.selectedCell));
                }
                break;
            case KeyCode.Escape:
                if (this.board && this.board.selectedCell) {
                    this.store.dispatch(PuzzleActions.deselectCells());
                }
                break;
            case KeyCode.Enter:
            case KeyCode.Space:
                if (this.board && this.board.selectedCell) {
                    this.store.dispatch(PuzzleActions.toggleGuessMode(this.board.selectedCell));
                }
                break;
            default:
                handled = false;
                break;
        }

        if (handled) {
            $e.preventDefault();
        }
    }

    private keyboardMoveCell(deltaX: number, deltaY: number): void {
        if (!this.board) return;

        // If no cell is selected, select the middle.
        if (!this.board.selectedCell) {
            this.store.dispatch(PuzzleActions.selectCell({row: 4, col: 4}));
            return;
        }

        // Apply deltas to select a new cell. The reducer handles bounds checking.
        const row = this.board.selectedCell.row + deltaY;
        const col = this.board.selectedCell.col + deltaX;
        this.store.dispatch(PuzzleActions.selectCell({row, col}))
    }
}
