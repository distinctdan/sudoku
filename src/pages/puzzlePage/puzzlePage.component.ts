import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from "rxjs";

import { LoadState } from 'src/enums/LoadState';
import { AppState } from 'src/store';
import { PuzzleService } from 'src/services/puzzle.service';
import { IPuzzle } from 'src/store/puzzle/types';
import * as PuzzleActions from 'src/store/puzzle/actions/puzzle.actions';
import * as PuzzleAPIActions from 'src/store/puzzle/actions/puzzleAPI.actions';
import * as PuzzleSelectors from 'src/store/puzzle/selectors/puzzle.selector';

@Component({
    selector: 'puzzle-page',
    templateUrl: './puzzlePage.component.html',
    styleUrls: ['./puzzlePage.component.scss']
})
export class PuzzlePageComponent implements OnInit, OnDestroy {
    // So we can use enums in the template
    public LoadState = LoadState;

    private activePuzzleSub: Subscription;
    public loadingState = LoadState.Initial;
    public puzzle: IPuzzle;
    public title = '';

    constructor(
        private puzzleService: PuzzleService,
        private route: ActivatedRoute,
        private store: Store<AppState>,
    ) {

    }

    ngOnInit() {
        const puzzleId = this.route.snapshot.paramMap.get('id');
        this.title = this.puzzleService.getPuzzleName(puzzleId);

        this.store.dispatch(PuzzleActions.setActivePuzzle({ puzzleId }));

        // Load the puzzle if it's not already in the store
        this.activePuzzleSub = this.store.select(PuzzleSelectors.selectActivePuzzle)
            .subscribe((activePuzzle) => {
                this.puzzle = activePuzzle;

                if (!activePuzzle) {
                    if (this.loadingState === LoadState.Initial) {
                        this.loadingState = LoadState.Loading
                        this.store.dispatch(PuzzleAPIActions.loadPuzzle({ puzzleId }));
                    }
                } else {
                    this.loadingState = LoadState.Success;
                }
            });
    }

    ngOnDestroy() {
        this.activePuzzleSub.unsubscribe();
    }
}
