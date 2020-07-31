import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { IPuzzle, IPuzzleCell } from 'src/store/puzzle';
import { PuzzleActions } from 'src/store/puzzle';

@Component({
    selector: 'puzzle-board',
    templateUrl: './puzzleBoard.component.html',
    styleUrls: ['./puzzleBoard.component.scss']
})
export class PuzzleBoardComponent {
    @Input() board: IPuzzle;

    constructor(private store: Store) {

    }

    public onCellClick($e, cell: IPuzzleCell) {
        $e.preventDefault();
        this.store.dispatch(PuzzleActions.selectCell({
            row: cell.row,
            col: cell.col
        }));
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
}
