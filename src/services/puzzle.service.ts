import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { PuzzleColor, PuzzleDifficulty } from 'src/enums';
import { IPuzzle, IPuzzleCell } from 'src/store/puzzle';

interface IPuzzleResponse {
    response: boolean;
    size: string;
    squares: {x: number, y: number, value: number}[];
}

export interface IPuzzleListItem {
    name: string,
    id: string,
    difficulty: PuzzleDifficulty,
}

@Injectable({
    providedIn: 'root',
})
export class PuzzleService {
    // Mocked puzzle responses from the API.
    private puzzleResponses: {[id: string]: IPuzzleResponse} = {
        '1': {"response":true,"size":"9","squares":[{"x":0,"y":1,"value":7},{"x":0,"y":4,"value":5},{"x":0,"y":5,"value":8},{"x":0,"y":7,"value":9},{"x":1,"y":1,"value":8},{"x":1,"y":3,"value":2},{"x":1,"y":7,"value":6},{"x":1,"y":8,"value":1},{"x":2,"y":0,"value":1},{"x":2,"y":5,"value":9},{"x":2,"y":6,"value":8},{"x":2,"y":8,"value":7},{"x":3,"y":1,"value":5},{"x":3,"y":2,"value":1},{"x":3,"y":5,"value":4},{"x":3,"y":6,"value":7},{"x":3,"y":7,"value":3},{"x":4,"y":2,"value":7},{"x":4,"y":4,"value":2},{"x":4,"y":5,"value":1},{"x":4,"y":6,"value":9},{"x":4,"y":8,"value":6},{"x":5,"y":1,"value":4},{"x":5,"y":2,"value":2},{"x":5,"y":5,"value":3},{"x":5,"y":6,"value":1},{"x":5,"y":7,"value":8},{"x":6,"y":0,"value":7},{"x":6,"y":6,"value":3},{"x":6,"y":7,"value":2},{"x":6,"y":8,"value":9},{"x":7,"y":0,"value":2},{"x":7,"y":1,"value":9},{"x":7,"y":3,"value":3},{"x":7,"y":4,"value":1},{"x":7,"y":7,"value":7},{"x":8,"y":0,"value":3},{"x":8,"y":3,"value":9},{"x":8,"y":4,"value":7},{"x":8,"y":8,"value":4}]},
        '2': {"response":true,"size":"9","squares":[{"x":0,"y":0,"value":9},{"x":0,"y":3,"value":3},{"x":0,"y":4,"value":7},{"x":0,"y":6,"value":1},{"x":0,"y":8,"value":5},{"x":1,"y":1,"value":8},{"x":1,"y":2,"value":1},{"x":1,"y":3,"value":5},{"x":1,"y":5,"value":4},{"x":1,"y":7,"value":9},{"x":2,"y":3,"value":9},{"x":2,"y":4,"value":1},{"x":2,"y":7,"value":3},{"x":2,"y":8,"value":4},{"x":3,"y":1,"value":6},{"x":3,"y":2,"value":5},{"x":3,"y":4,"value":3},{"x":3,"y":5,"value":7},{"x":3,"y":6,"value":4},{"x":3,"y":7,"value":8},{"x":4,"y":0,"value":2},{"x":4,"y":1,"value":4},{"x":4,"y":7,"value":1},{"x":4,"y":8,"value":3},{"x":5,"y":2,"value":9},{"x":5,"y":3,"value":4},{"x":5,"y":4,"value":5},{"x":5,"y":6,"value":6},{"x":6,"y":1,"value":9},{"x":6,"y":4,"value":2},{"x":6,"y":5,"value":5},{"x":6,"y":8,"value":8},{"x":7,"y":1,"value":1},{"x":7,"y":3,"value":7},{"x":7,"y":5,"value":3},{"x":7,"y":7,"value":5},{"x":8,"y":0,"value":5},{"x":8,"y":4,"value":4},{"x":8,"y":5,"value":9},{"x":8,"y":6,"value":3},{"x":8,"y":8,"value":1}]},
        '3': {"response":true,"size":"9","squares":[{"x":0,"y":2,"value":7},{"x":0,"y":6,"value":3},{"x":1,"y":3,"value":3},{"x":1,"y":4,"value":7},{"x":1,"y":5,"value":5},{"x":1,"y":6,"value":6},{"x":2,"y":0,"value":1},{"x":2,"y":1,"value":5},{"x":2,"y":5,"value":9},{"x":2,"y":7,"value":8},{"x":2,"y":8,"value":2},{"x":3,"y":1,"value":3},{"x":3,"y":2,"value":4},{"x":3,"y":4,"value":6},{"x":3,"y":5,"value":8},{"x":3,"y":6,"value":9},{"x":4,"y":0,"value":2},{"x":4,"y":3,"value":9},{"x":4,"y":4,"value":5},{"x":4,"y":5,"value":1},{"x":4,"y":8,"value":3},{"x":5,"y":0,"value":9},{"x":5,"y":4,"value":3},{"x":5,"y":6,"value":5},{"x":5,"y":7,"value":2},{"x":5,"y":8,"value":8},{"x":6,"y":1,"value":8},{"x":6,"y":3,"value":4},{"x":6,"y":7,"value":5},{"x":7,"y":0,"value":7},{"x":7,"y":1,"value":9},{"x":7,"y":3,"value":8},{"x":7,"y":5,"value":3},{"x":7,"y":8,"value":6},{"x":8,"y":0,"value":6},{"x":8,"y":2,"value":2},{"x":8,"y":3,"value":5},{"x":8,"y":6,"value":8},{"x":8,"y":7,"value":3},{"x":8,"y":8,"value":9}]},
        '4': {"response":true,"size":"9","squares":[{"x":0,"y":0,"value":3},{"x":0,"y":2,"value":4},{"x":0,"y":6,"value":5},{"x":1,"y":2,"value":2},{"x":1,"y":5,"value":7},{"x":1,"y":6,"value":6},{"x":2,"y":0,"value":6},{"x":2,"y":3,"value":2},{"x":2,"y":4,"value":3},{"x":3,"y":1,"value":6},{"x":3,"y":2,"value":7},{"x":3,"y":3,"value":9},{"x":3,"y":7,"value":3},{"x":4,"y":0,"value":2},{"x":4,"y":3,"value":6},{"x":4,"y":4,"value":5},{"x":4,"y":5,"value":1},{"x":5,"y":1,"value":4},{"x":5,"y":5,"value":2},{"x":5,"y":6,"value":8},{"x":5,"y":7,"value":1},{"x":6,"y":3,"value":7},{"x":6,"y":4,"value":1},{"x":6,"y":8,"value":8},{"x":7,"y":2,"value":3},{"x":7,"y":6,"value":1},{"x":7,"y":7,"value":6},{"x":8,"y":0,"value":5},{"x":8,"y":1,"value":8},{"x":8,"y":5,"value":6},{"x":8,"y":7,"value":7}]},
        '5': {"response":true,"size":"9","squares":[{"x":0,"y":3,"value":7},{"x":0,"y":5,"value":8},{"x":0,"y":8,"value":3},{"x":1,"y":0,"value":4},{"x":1,"y":2,"value":3},{"x":1,"y":4,"value":2},{"x":1,"y":6,"value":8},{"x":2,"y":2,"value":7},{"x":2,"y":3,"value":9},{"x":2,"y":5,"value":4},{"x":2,"y":6,"value":5},{"x":2,"y":7,"value":2},{"x":3,"y":1,"value":3},{"x":3,"y":2,"value":8},{"x":3,"y":7,"value":1},{"x":4,"y":3,"value":2},{"x":4,"y":4,"value":4},{"x":4,"y":5,"value":7},{"x":5,"y":0,"value":6},{"x":5,"y":1,"value":4},{"x":5,"y":2,"value":2},{"x":5,"y":4,"value":8},{"x":5,"y":7,"value":5},{"x":6,"y":7,"value":3},{"x":6,"y":8,"value":5},{"x":7,"y":0,"value":8},{"x":7,"y":4,"value":6},{"x":8,"y":0,"value":3},{"x":8,"y":3,"value":4},{"x":8,"y":5,"value":2}]},
        '6': {"response":true,"size":"9","squares":[{"x":0,"y":1,"value":1},{"x":0,"y":2,"value":4},{"x":0,"y":6,"value":6},{"x":0,"y":8,"value":3},{"x":1,"y":3,"value":1},{"x":1,"y":5,"value":2},{"x":1,"y":7,"value":8},{"x":2,"y":2,"value":2},{"x":2,"y":4,"value":6},{"x":2,"y":5,"value":8},{"x":2,"y":6,"value":9},{"x":3,"y":1,"value":5},{"x":3,"y":2,"value":6},{"x":3,"y":3,"value":7},{"x":3,"y":6,"value":3},{"x":4,"y":3,"value":6},{"x":4,"y":4,"value":4},{"x":4,"y":7,"value":1},{"x":5,"y":0,"value":1},{"x":5,"y":1,"value":8},{"x":5,"y":5,"value":3},{"x":5,"y":8,"value":6},{"x":6,"y":1,"value":4},{"x":6,"y":5,"value":7},{"x":6,"y":7,"value":6},{"x":7,"y":2,"value":8},{"x":7,"y":3,"value":3},{"x":7,"y":7,"value":7},{"x":8,"y":7,"value":3},{"x":8,"y":8,"value":4}]},
        '7': {"response":true,"size":"9","squares":[{"x":0,"y":3,"value":2},{"x":0,"y":8,"value":6},{"x":1,"y":0,"value":3},{"x":1,"y":2,"value":5},{"x":1,"y":5,"value":1},{"x":2,"y":2,"value":2},{"x":3,"y":4,"value":1},{"x":4,"y":0,"value":5},{"x":4,"y":8,"value":3},{"x":5,"y":1,"value":3},{"x":5,"y":4,"value":2},{"x":5,"y":7,"value":6},{"x":6,"y":0,"value":2},{"x":6,"y":2,"value":3},{"x":6,"y":4,"value":6},{"x":7,"y":3,"value":1},{"x":7,"y":6,"value":6},{"x":8,"y":1,"value":4},{"x":8,"y":3,"value":9},{"x":8,"y":8,"value":2}]},
        '8': {"response":true,"size":"9","squares":[{"x":0,"y":0,"value":4},{"x":0,"y":2,"value":9},{"x":0,"y":6,"value":2},{"x":1,"y":5,"value":5},{"x":1,"y":7,"value":8},{"x":2,"y":3,"value":8},{"x":2,"y":7,"value":4},{"x":3,"y":5,"value":8},{"x":3,"y":6,"value":4},{"x":3,"y":7,"value":3},{"x":4,"y":0,"value":3},{"x":4,"y":8,"value":1},{"x":5,"y":1,"value":9},{"x":5,"y":2,"value":8},{"x":5,"y":3,"value":4},{"x":6,"y":1,"value":3},{"x":7,"y":5,"value":4},{"x":7,"y":8,"value":7},{"x":8,"y":2,"value":4},{"x":8,"y":6,"value":3},{"x":8,"y":8,"value":8}]},
        '9': {"response":true,"size":"9","squares":[{"x":0,"y":0,"value":8},{"x":0,"y":4,"value":6},{"x":1,"y":6,"value":2},{"x":2,"y":3,"value":1},{"x":2,"y":5,"value":4},{"x":2,"y":7,"value":6},{"x":3,"y":4,"value":4},{"x":3,"y":8,"value":2},{"x":5,"y":1,"value":9},{"x":5,"y":7,"value":1},{"x":5,"y":8,"value":6},{"x":6,"y":2,"value":8},{"x":6,"y":8,"value":9},{"x":7,"y":0,"value":4},{"x":7,"y":5,"value":1},{"x":7,"y":6,"value":6},{"x":7,"y":8,"value":7},{"x":8,"y":1,"value":6},{"x":8,"y":3,"value":4},{"x":8,"y":4,"value":9},{"x":8,"y":7,"value":2}]},
    }

    private puzzlesList: IPuzzleListItem[] = [
        {name: 'Puzzle 1', id: '1', difficulty: PuzzleDifficulty.Easy},
        {name: 'Puzzle 2', id: '2', difficulty: PuzzleDifficulty.Easy},
        {name: 'Puzzle 3', id: '3', difficulty: PuzzleDifficulty.Easy},
        {name: 'Puzzle 4', id: '4', difficulty: PuzzleDifficulty.Medium},
        {name: 'Puzzle 5', id: '5', difficulty: PuzzleDifficulty.Medium},
        {name: 'Puzzle 6', id: '6', difficulty: PuzzleDifficulty.Medium},
        {name: 'Puzzle 7', id: '7', difficulty: PuzzleDifficulty.Hard},
        {name: 'Puzzle 8', id: '8', difficulty: PuzzleDifficulty.Hard},
        {name: 'Puzzle 9', id: '9', difficulty: PuzzleDifficulty.Hard},
    ]

    constructor(
        private http: HttpClient,
    ) {}

    public getPuzzlesList(): IPuzzleListItem[] {
        // Mocking API
        return this.puzzlesList;
    }

    public getPuzzleName(id: string): string {
        for (const listItem of this.puzzlesList) {
            if (listItem.id === id) return listItem.name;
        }

        return `Puzzle ?`
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
