import { Component, OnDestroy, OnInit } from '@angular/core';
import { IPuzzleListItem, PuzzleService } from 'src/services/puzzle.service';
import { PuzzleDifficulty } from 'src/enums';
import { IPuzzlesState } from 'src/store/puzzle';
import { Store } from '@ngrx/store';
import { AppState } from 'src/store';
import * as PuzzleActions from 'src/store/puzzle/actions/puzzle.actions';
import * as PuzzleSelectors from 'src/store/puzzle/selectors/puzzle.selectors';
import * as PuzzleAPIActions from 'src/store/puzzle/actions/puzzleAPI.actions';
import { Subscription } from 'rxjs';

@Component({
    selector: 'puzzle-list-page',
    templateUrl: './puzzleListPage.component.html',
    styleUrls: ['./puzzleListPage.component.scss']
})
export class PuzzleListPageComponent implements OnInit, OnDestroy {
    // Enum for template
    public PuzzleDifficulty = PuzzleDifficulty;

    public puzzlesList: IPuzzleListItem[] = [];
    public puzzlesState: IPuzzlesState;

    private puzzlesSub: Subscription;

    constructor(
        private puzzleService: PuzzleService,
        private store: Store<AppState>,
    ) {
        this.puzzlesList = puzzleService.getPuzzlesList();
    }

    ngOnInit() {
        // Keep track of the app state so we can look up if a puzzles has been completed
        this.puzzlesSub = this.store.select(PuzzleSelectors.selectFeature)
            .subscribe((puzzles) => {
                this.puzzlesState = puzzles;
            });
    }

    ngOnDestroy() {
        if (this.puzzlesSub) this.puzzlesSub.unsubscribe();
    }

    public isPuzzleCompleted(puzzleId: string): boolean {
        return this.puzzlesState?.puzzles[puzzleId]?.hasWon;
    }

    public isPuzzleInProgress(puzzleId: string): boolean {
        const puzzle = this.puzzlesState?.puzzles[puzzleId];
        return puzzle && !puzzle.hasWon;
    }

    public trackByPuzzles(index, puzzle: IPuzzleListItem) {
        return puzzle.id;
    }
}
