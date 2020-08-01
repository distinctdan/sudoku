import { Injectable } from '@angular/core';
import { AppState } from 'src/store';
import { Store } from '@ngrx/store';

interface AppStateSaved extends AppState {
    __version: number,
}

@Injectable({
    providedIn: 'root',
})
export class SaveStateService {
    private lsKey = 'sudokuAppState';
    private version = 1;

    constructor(
        private store: Store<AppState>,
    ) {
        this.store.subscribe((state: AppState) => {
            this.saveState(state);
        });
    }

    public saveState(state: AppState): void {
        if (!state) return;

        const data: AppStateSaved = {
            ...state,
            __version: this.version,
        }

        // Not catching stringify errors here because there's nothing we can do.
        localStorage[this.lsKey] = JSON.stringify(data);
    }

    public loadState(): AppState {
        const dataStr = localStorage[this.lsKey];
        if (!dataStr) return undefined;

        const data: AppStateSaved = JSON.parse(dataStr);

        // Run the saved data through an upgrade check to see if it's an old version of the app.
        // This does nothing right now, but is useful if we change the format.
        switch (data.__version) {
            case 1:
                break;
        }

        delete data.__version;

        return <AppState>data;
    }
}
