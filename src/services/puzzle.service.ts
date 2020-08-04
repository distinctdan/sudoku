import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { PuzzleColor, PuzzleDifficulty } from 'src/enums';
import { IPuzzle, IPuzzleCell } from 'src/store/puzzle';
import { PuzzleMocks } from 'src/services/puzzleMocks';

type IPuzzleResponse = number[][];

export interface IPuzzleListItem {
    name: string,
    id: string,
    difficulty: PuzzleDifficulty,
}

@Injectable({
    providedIn: 'root',
})
export class PuzzleService {
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

    constructor() {}

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

    // Simulating API - couldn't find a publicly available sudoku api.
    public getPuzzle(puzzleId: string): Observable<IPuzzle> {
        return new Observable<IPuzzleResponse>((subscriber => {
                setTimeout(() => {
                    const puzzleResponse = PuzzleMocks[puzzleId];
                    if (puzzleResponse) {
                        subscriber.next(puzzleResponse);
                    } else {
                        throwError('Invalid puzzle id: ' + puzzleId);
                    }
                }, 250);
            }))
            .pipe(map((response: IPuzzleResponse) => {
                // Map the API's response to our puzzle format.
                const rows: IPuzzleCell[][] = [];

                for (let i = 0; i < 9; i++) {
                    rows[i] = [];

                    for (let j = 0; j < 9; j++) {
                        const num = response[i][j];
                        rows[i][j] = <IPuzzleCell>{
                            num: num !== 0 ? num : undefined,
                            isStarterVal: num !== 0,
                            guesses: {},
                            row: i,
                            col: j,
                        }
                    }
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
