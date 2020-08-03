import { Component, Input, OnChanges } from '@angular/core';
import { canToggleGuessMode, IPuzzle, PuzzleActions } from 'src/store/puzzle';
import { Store } from '@ngrx/store';
import { AppState } from 'src/store';
import { PuzzleColor } from 'src/enums';

@Component({
    selector: 'puzzle-controls',
    templateUrl: './puzzleControls.component.html',
    styleUrls: ['./puzzleControls.component.scss']
})
export class PuzzleControlsComponent implements OnChanges{
    @Input() board: IPuzzle;
    // Exporting enum for template.
    public PuzzleColor = PuzzleColor;

    public numberCounts = new Array(10).fill(0);
    public numberErrors = new Array(10).fill(false);

    constructor(private store: Store<AppState>) {}

    public ngOnChanges() {
        // We only have 1 input, so no need to check what changed.
        // Recalculate how many of each number are filled in,
        // as well as if there are errors for that num.
        const numCounts = new Array(10).fill(0);
        const numErrors = new Array(10).fill(false);

        if (this.board) {
            for (const row of this.board.rows) {
                for (const cell of row) {
                    if (cell.num) {
                        numCounts[cell.num]++;
                        if (cell.isError) {
                            numErrors[cell.num] = true;
                        }
                    }
                }
            }
        }
        this.numberCounts = numCounts;
        this.numberErrors = numErrors;
    }

    public canToggleGuessMode = () => {
        return this.board && canToggleGuessMode(this.board);
    }

    public isGuessMode = () => {
        if (!this.board || !this.board.selectedCell) return false;
        const { row, col } = this.board.selectedCell;
        const cell = this.board.rows[row][col];
        return cell.isGuessMode;
    }

    public isGuessColor = (color: PuzzleColor) => {
        if (!this.board) return;
        return this.board.guessColor === color;
    }

    public isNumPressed = (num: number): boolean => {
        if (!this.board) return false;

        if (this.board.showingAllNum === num) return true;

        if (this.board.selectedCell) {
            const { row, col } = this.board.selectedCell;
            const cell = this.board.rows[row][col];
            return cell.num === num || cell.guesses[num];
        }

        return false;
    }

    public onClearCell = () => {
        if (this.board && this.board.selectedCell) {
            const { row, col } = this.board.selectedCell;
            this.store.dispatch(PuzzleActions.clearCell({ row, col }));
        }
    }

    public onNumPress = (num: number): void => {
        if (!this.board) return;

        // 2 Modes:
        // - Toggling a number on the selected cell.
        // - Showing all of a certain number.
        if (this.board.selectedCell) {
            const { row, col } = this.board.selectedCell;
            this.store.dispatch(PuzzleActions.toggleNum({ row, col, num }));
        } else {
            this.store.dispatch(PuzzleActions.toggleShowAllOfNum({ num }));
        }
    }

    public onSetGuessColor = (color: PuzzleColor): void => {
        if (!this.board) return;
        this.store.dispatch(PuzzleActions.setGuessColor({ color }));
    }

    public onToggleGuessMode = (): void => {
        if (!this.board || !canToggleGuessMode(this.board)) return;
        const { row, col } = this.board.selectedCell;
        this.store.dispatch(PuzzleActions.toggleGuessMode({ row, col }))
    }
}
