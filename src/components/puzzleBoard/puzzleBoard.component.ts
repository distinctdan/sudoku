import { Component, Input } from '@angular/core';
import { IPuzzle, IPuzzleCell } from "src/services/puzzle.service";

@Component({
    selector: 'puzzle-board',
    templateUrl: './puzzleBoard.component.html',
    styleUrls: ['./puzzleBoard.component.scss']
})
export class PuzzleBoardComponent {

    @Input() board: IPuzzle;

    constructor() {

    }

    public onCellClick($e, cell: IPuzzleCell) {
        console.log('cell clicked: ', cell);
        $e.preventDefault();
    }
}
