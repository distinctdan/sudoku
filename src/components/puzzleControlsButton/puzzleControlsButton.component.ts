import { Component, EventEmitter, HostListener, Input, HostBinding, Output } from '@angular/core';

@Component({
    selector: 'puzzle-controls-button',
    templateUrl: './puzzleControlsButton.component.html',
    styleUrls: ['./puzzleControlsButton.component.scss'],
})
export class PuzzleControlsButtonComponent {
    @Input() disabled: boolean;
    @Input() pressed: boolean;
    @Output() onPress = new EventEmitter<void>();

    @HostBinding('class.pressed') get classPressed() { return this.pressed; }
    @HostBinding('class.disabled') get classDisabled() { return this.disabled; }

    @HostListener('click')
    public onClick() {
        if (!this.disabled) {
            this.onPress.emit();
        }
    }
}
