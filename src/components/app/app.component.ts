import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    // Using redux, so use onPush for performance.
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

}
