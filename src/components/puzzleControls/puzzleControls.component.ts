import { Component } from '@angular/core';
import {IPuzzleListItem, PuzzleService} from 'src/services/puzzle.service';

@Component({
    selector: 'puzzle-controls',
    templateUrl: './puzzleControls.component.html',
    styleUrls: ['./puzzleControls.component.scss']
})
export class PuzzleControlsComponent {
    public puzzles: IPuzzleListItem[] = [];

    constructor(puzzleService: PuzzleService) {
        this.puzzles = puzzleService.getPuzzlesList();
    }

    public trackByPuzzles(puzzle: IPuzzleListItem, index) {
        return puzzle.id;
    }
}
