import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IPuzzle, PuzzleService} from "src/services/puzzle.service";
import {LoadState} from 'src/enums/LoadState';

interface IRouteParams {
    id?: string,
}

@Component({
    selector: 'puzzle-page',
    templateUrl: './puzzlePage.component.html',
    styleUrls: ['./puzzlePage.component.scss']
})
export class PuzzlePageComponent {
    // So we can use enums in the template
    public LoadState = LoadState;

    public loadingState = LoadState.Loading;
    public puzzle: IPuzzle;
    public title = '';

    constructor(
        private puzzleService: PuzzleService,
        private route: ActivatedRoute,
    ) {

    }

    ngOnInit() {
        const puzzleId = this.route.snapshot.paramMap.get('id');
        this.title = this.puzzleService.getPuzzleName(puzzleId);
        this.puzzleService.getPuzzle(puzzleId).subscribe((puzzle) => {
            this.puzzle = puzzle;
            this.loadingState = LoadState.Success;
        });
    }
}
