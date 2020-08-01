import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { PuzzleColor } from 'src/enums';
import { IPuzzle, IPuzzleCell } from 'src/store/puzzle';

interface IPuzzleResponse {
    response: boolean;
    size: string;
    squares: {x: number, y: number, value: number}[];
}

export interface IPuzzleListItem {
    name: string,
    id: string,
}

@Injectable({
    providedIn: 'root',
})
export class PuzzleService {
    // Mocked puzzle responses from the API.
    private puzzleResponses: {[id: number]: IPuzzleResponse} = {
        '1': {"response":true,"size":"9","squares":[{"x":0,"y":3,"value":2},{"x":0,"y":8,"value":6},{"x":1,"y":0,"value":3},{"x":1,"y":2,"value":5},{"x":1,"y":5,"value":1},{"x":2,"y":2,"value":2},{"x":3,"y":4,"value":1},{"x":4,"y":0,"value":5},{"x":4,"y":8,"value":3},{"x":5,"y":1,"value":3},{"x":5,"y":4,"value":2},{"x":5,"y":7,"value":6},{"x":6,"y":0,"value":2},{"x":6,"y":2,"value":3},{"x":6,"y":4,"value":6},{"x":7,"y":3,"value":1},{"x":7,"y":6,"value":6},{"x":8,"y":1,"value":4},{"x":8,"y":3,"value":9},{"x":8,"y":8,"value":2}]},
        '2': {"response":true,"size":"9","squares":[{"x":0,"y":0,"value":4},{"x":0,"y":2,"value":9},{"x":0,"y":6,"value":2},{"x":1,"y":5,"value":5},{"x":1,"y":7,"value":8},{"x":2,"y":3,"value":8},{"x":2,"y":7,"value":4},{"x":3,"y":5,"value":8},{"x":3,"y":6,"value":4},{"x":3,"y":7,"value":3},{"x":4,"y":0,"value":3},{"x":4,"y":8,"value":1},{"x":5,"y":1,"value":9},{"x":5,"y":2,"value":8},{"x":5,"y":3,"value":4},{"x":6,"y":1,"value":3},{"x":7,"y":5,"value":4},{"x":7,"y":8,"value":7},{"x":8,"y":2,"value":4},{"x":8,"y":6,"value":3},{"x":8,"y":8,"value":8}]},
        '3': {"response":true,"size":"9","squares":[{"x":0,"y":0,"value":8},{"x":0,"y":4,"value":6},{"x":1,"y":6,"value":2},{"x":2,"y":3,"value":1},{"x":2,"y":5,"value":4},{"x":2,"y":7,"value":6},{"x":3,"y":4,"value":4},{"x":3,"y":8,"value":2},{"x":5,"y":1,"value":9},{"x":5,"y":7,"value":1},{"x":5,"y":8,"value":6},{"x":6,"y":2,"value":8},{"x":6,"y":8,"value":9},{"x":7,"y":0,"value":4},{"x":7,"y":5,"value":1},{"x":7,"y":6,"value":6},{"x":7,"y":8,"value":7},{"x":8,"y":1,"value":6},{"x":8,"y":3,"value":4},{"x":8,"y":4,"value":9},{"x":8,"y":7,"value":2}]},
    }

    constructor(
        private http: HttpClient,
    ) {}

    public getPuzzlesList(): IPuzzleListItem[] {
        const ids = Object.keys(this.puzzleResponses);
        return ids.map((id, i) => {
            return {
                name: this.getPuzzleName(id),
                id: id,
            };
        });
    }

    public getPuzzleName(id: string): string {
        // Inefficient, but we only have a few puzzles.
        const ids = Object.keys(this.puzzleResponses);
        const i = ids.indexOf(id);

        if (i === -1) return `Puzzle ?`;
        return `Puzzle ${i + 1}`
    }

    // Simulating API
    // Puzzles taken from http://www.cs.utep.edu/cheon/ws/sudoku/new/?size=9&level=3
    // They're not available cross-origin, so we're mocking them.
    public getPuzzle(puzzleId: string): Observable<IPuzzle> {
        const size = 9;

        return new Observable<IPuzzleResponse>((subscriber => {
                setTimeout(() => {
                    const puzzleResponse = this.puzzleResponses[puzzleId];
                    if (puzzleResponse) {
                        subscriber.next(puzzleResponse);
                    } else {
                        throwError('Invalid puzzle id: ' + puzzleId);
                    }
                }, 250);
            }))
            .pipe(map((response) => {
                // Map the API's response to our puzzle format.
                // The PuzzleService doesn't care about guesses or errors,
                // but it's cleaner to use the same puzzle format across the app.
                const rows: IPuzzleCell[][] = [];

                for (let i = 0; i < size; i++) {
                    const cols: IPuzzleCell[] = [];
                    for (let j = 0; j < size; j++) {
                        // Create empty cells
                        cols[j] = {
                            num: undefined,
                            isStarterVal: false,
                            guesses: {},
                            row: i,
                            col: j,
                        };
                    }
                    rows[i] = cols;
                }

                // Now fill in the starter squares
                for (const square of response.squares) {
                    const cell = rows[square.y][square.x];
                    cell.num = square.value;
                    cell.isStarterVal = true;
                }

                return {
                    guessColor: PuzzleColor.Blue,
                    id: puzzleId,
                    rows,
                    selectedCell: undefined,
                    showingAllNum: undefined,
                };
            }));
    }
}
