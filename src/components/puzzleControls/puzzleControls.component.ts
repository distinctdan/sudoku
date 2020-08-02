import { Component, Input } from '@angular/core';
import { canToggleGuessMode, IPuzzle, PuzzleActions } from 'src/store/puzzle';
import { Store } from '@ngrx/store';
import { AppState } from 'src/store';
import { PuzzleColor } from 'src/enums';

@Component({
    selector: 'puzzle-controls',
    templateUrl: './puzzleControls.component.html',
    styleUrls: ['./puzzleControls.component.scss']
})
export class PuzzleControlsComponent {
    @Input() board: IPuzzle;
    // Exporting enum for template.
    public PuzzleColor = PuzzleColor;

    constructor(private store: Store<AppState>) {}

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
