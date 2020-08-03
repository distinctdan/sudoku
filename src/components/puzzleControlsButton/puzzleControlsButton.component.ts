import { Component, EventEmitter, HostListener, Input, HostBinding, Output } from '@angular/core';

@Component({
    selector: 'puzzle-controls-button',
    templateUrl: './puzzleControlsButton.component.html',
    styleUrls: ['./puzzleControlsButton.component.scss'],
})
export class PuzzleControlsButtonComponent {
    @Input() disabled: boolean;
    @Input() pressed: boolean;
    @Input() numCount: number;
    @Input() isError: boolean;
    @Output() onPress = new EventEmitter<void>();

    @HostBinding('class.pressed') get classPressed() { return this.pressed; }
    @HostBinding('class.disabled') get classDisabled() { return this.disabled; }
    @HostBinding('class.error') get classError() { return this.isError; }
    @HostBinding('class.completed') get classCompleted() { return !this.isError && this.numCount === 9; }

    @HostListener('click')
    public onClick() {
        if (!this.disabled) {
            this.onPress.emit();
        }
    }
}
