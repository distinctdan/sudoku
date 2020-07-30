import { Component, Input } from '@angular/core';
import { IPuzzle, IPuzzleCell } from "src/store/puzzle/types";
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

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
        console.log('cell clicked: ', cell);
        $e.preventDefault();
    }
}
