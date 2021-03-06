import { Component, HostListener, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { IPuzzle, IPuzzleCell, IPuzzleGuess } from 'src/store/puzzle';
import { PuzzleActions } from 'src/store/puzzle';
import { KeyCode, PuzzleColor } from 'src/enums';

@Component({
    selector: 'puzzle-board',
    templateUrl: './puzzleBoard.component.html',
    styleUrls: ['./puzzleBoard.component.scss']
})
export class PuzzleBoardComponent {
    @Input() board: IPuzzle;

    constructor(private store: Store) {

    }

    public isCellRowColSelected(cell: IPuzzleCell): boolean {
        const selectedCell = this.board && this.board.selectedCell;
        return selectedCell && (
            cell.row === selectedCell.row
            || cell.col === selectedCell.col
        )
    }

    public isCellSelected(cell: IPuzzleCell): boolean {
        const selectedCell = this.board && this.board.selectedCell;
        return selectedCell
            && cell.row === selectedCell.row
            && cell.col === selectedCell.col;
    }

    public isShowingAllOfNum(cell: IPuzzleCell): boolean {
        const showingAllNum = this.board?.showingAllNum;
        return showingAllNum && cell.num && cell.num === showingAllNum;
    }

    public onCellClick = ($e: MouseEvent, cell: IPuzzleCell) => {
        this.store.dispatch(PuzzleActions.selectCell({
            row: cell.row,
            col: cell.col
        }));
    }

    @HostListener('keydown', ['$event'])
    public onKeyDown = ($e: KeyboardEvent) => {
        if ($e.defaultPrevented) return;

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

    // This is separate from onKeyDown because we need the text value of the key
    // for numbers to work.
    @HostListener('keypress', ['$event'])
    public onKeypress = ($e: KeyboardEvent) => {
        if (!this.board || !this.board.selectedCell) return;

        let char = '';
        if ($e.key) {
            char = $e.key;
        } else {
            char = String.fromCharCode($e.keyCode || $e.which);
        }

        const num = parseInt(char, 10);
        if (num >= 1 && num <= 9) {
            const { row, col } = this.board.selectedCell;
            this.store.dispatch(PuzzleActions.toggleNum({
                row,
                col,
                num,
            }))
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
