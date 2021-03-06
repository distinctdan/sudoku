import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from "rxjs";

import { LoadState } from 'src/enums/LoadState';
import { AppState } from 'src/store';
import { PuzzleService } from 'src/services/puzzle.service';
import { IPuzzle } from 'src/store/puzzle/types';
import { PuzzleActions, PuzzleAPIActions, selectActivePuzzle } from 'src/store/puzzle';

@Component({
    selector: 'puzzle-page',
    templateUrl: './puzzlePage.component.html',
    styleUrls: ['./puzzlePage.component.scss'],
})
export class PuzzlePageComponent implements OnInit, OnDestroy {
    @ViewChild('boardRef', {read: ElementRef}) boardRef: ElementRef;
    @ViewChild('controlsRef', {read: ElementRef}) controlsRef: ElementRef;

    // So we can use enums in the template
    public LoadState = LoadState;

    private activePuzzleSub: Subscription;
    public loadingState = LoadState.Initial;
    public puzzle$: Observable<IPuzzle> = this.store.select(selectActivePuzzle);
    public title = '';

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
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
        this.puzzle$ = this.store.select(selectActivePuzzle);
        this.activePuzzleSub = this.puzzle$.subscribe((activePuzzle) => {
            if (!activePuzzle) {
                if (this.loadingState === LoadState.Initial) {
                    this.loadingState = LoadState.Loading
                    this.store.dispatch(PuzzleAPIActions.loadPuzzle({ puzzleId }));
                }
            } else {
                this.loadingState = LoadState.Success;
            }
            // Our loadingState prop is local state, so need to mark it as changed.
            this.changeDetectorRef.markForCheck();
        });
    }

    ngOnDestroy() {
        if (this.activePuzzleSub) this.activePuzzleSub.unsubscribe();
    }

    // Manages focus. We want to keep the board focused for keyboard events to work.
    @HostListener('window:click', ['$event'])
    public onWindowClick = ($e: MouseEvent) => {
        // Make sure we're rendered.
        if (!this.boardRef || !this.boardRef.nativeElement
            || !this.controlsRef || !this.controlsRef.nativeElement
        ) {
            return;
        }

        if (this.controlsRef.nativeElement.contains($e.target)) {
            // If the user clicked the controls, focus the board so that keyboard events still work.
            this.boardRef.nativeElement.focus({preventScroll: true});
        } else if (this.boardRef.nativeElement.contains($e.target)) {
            // Board was clicked, do nothing.
        } else {
            // User clicked outside the board and controls: deselect.
            this.store.dispatch(PuzzleActions.deselectCells());
        }
    }
}
