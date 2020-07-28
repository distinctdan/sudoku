import { Directive, ElementRef, Input } from '@angular/core';
import { PuzzleColor } from 'src/enums/PuzzleColor';

@Directive({
    selector: '[puzzleCellColor]'
})
export class PuzzleCellColorDirective {
    private _color: PuzzleColor;
    private colorsClassMap = {
        [PuzzleColor.Blue]: 'puzzleColor_blue',
        [PuzzleColor.Green]: 'puzzleColor_green',
        [PuzzleColor.Red]: 'puzzleColor_red',
    }

    @Input('puzzleCellColor')
    set color(c: PuzzleColor) {
        if (c !== this._color) {
            // Clear previous color class if needed
            if (this._color) {
                const oldColorClass = this.colorsClassMap[this._color];
                this.el.nativeElement.classList.remove(oldColorClass);
            }

            // Add new color class
            const newColorClass = this.colorsClassMap[c];
            if (newColorClass) {
                this.el.nativeElement.classList.add(newColorClass);
            } else {
                console.log('ERROR: unknown color: ', c);
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
