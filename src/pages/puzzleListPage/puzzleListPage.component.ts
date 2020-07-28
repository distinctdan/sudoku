import { Component } from '@angular/core';
import {IPuzzleListItem, PuzzleService} from 'src/services/puzzle.service';

@Component({
    selector: 'puzzle-list-page',
    templateUrl: './puzzleListPage.component.html',
    styleUrls: ['./puzzleListPage.component.scss']
})
export class PuzzleListPageComponent {
    public puzzles: IPuzzleListItem[] = [];

    constructor(puzzleService: PuzzleService) {
        this.puzzles = puzzleService.getPuzzlesList();
    }

    public trackByPuzzles(index, puzzle: IPuzzleListItem) {
        return puzzle.id;
    }
}
