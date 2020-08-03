import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { PuzzleService } from 'src/services/puzzle.service';
import * as PuzzleAPIActions from "src/store/puzzle/actions/puzzleAPI.actions";

@Injectable()
export class PuzzleEffects {
    loadPuzzle$ = createEffect(() => this.actions$.pipe(
        ofType(PuzzleAPIActions.loadPuzzle),
        mergeMap((action) => {
            return this.puzzleService.getPuzzle(action.puzzleId).pipe(
                map(puzzle => {
                    return PuzzleAPIActions.loadPuzzleSuccess({puzzle: puzzle})
                }),
                catchError((err) => {
                    console.log('puzzle load err: ', err, action.puzzleId);
                    return of(PuzzleAPIActions.loadPuzzleError({puzzleId: action.puzzleId, err: err}));
                })
            );
        })
    ));

    constructor(
        private actions$: Actions,
        private puzzleService: PuzzleService
    ) {}
}
