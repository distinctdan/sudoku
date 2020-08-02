import { Directive, ElementRef, Input } from '@angular/core';
import { PuzzleColor } from 'src/enums/PuzzleColor';

// This directive is basically an ng-class, to avoid having to repeat the ng-class
@Directive({
    selector: '[puzzleCellClasses]'
})
export class PuzzleCellClassesDirective {
    private _color: PuzzleColor;
    private _hasGuess = false;
    private colorsClassMap = {
        [PuzzleColor.Blue]: 'puzzleColor_blue',
        [PuzzleColor.Yellow]: 'puzzleColor_yellow',
        [PuzzleColor.Red]: 'puzzleColor_red',
    }

    @Input('puzzleCellClasses')
    set color(c: PuzzleColor) {
        const el: ElementRef<HTMLDivElement> = this.el;
        // Add a class if this cell has a guess.
        const guessClass = 'hasGuess';

        const hasGuess = !!c;
        if (hasGuess !== this._hasGuess) {
            el.nativeElement.classList.toggle('hasGuess', hasGuess);
        }

        if (c !== this._color) {
            // Clear previous color class if needed
            if (this._color) {
                const oldColorClass = this.colorsClassMap[this._color];
                this.el.nativeElement.classList.remove(oldColorClass);
            }

            // Add new color class
            if (c) {
                const newColorClass = this.colorsClassMap[c];
                if (newColorClass) {
                    this.el.nativeElement.classList.add(newColorClass);
                } else {
                    console.log('ERROR: unknown color: ', c);
                }
            }

            this._color = c;
        }
    }
    get color(): PuzzleColor {
        return this._color;
    }

    constructor(private el: ElementRef) {

    }
}
