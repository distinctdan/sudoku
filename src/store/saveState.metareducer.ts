import {ActionReducer, Action} from '@ngrx/store';
import {merge, cloneDeep} from 'lodash';
import { AppState } from 'src/store/index';

interface AppStateSaved extends AppState {
    __version: number,
}

const lsKey = 'sudokuAppState';
const version = 1;

function saveState(state: AppState): void {
    if (!state) return;

    const data: AppStateSaved = {
        ...state,
        __version: version,
    }

    // Not catching stringify errors here because there's nothing we can do.
    localStorage[lsKey] = JSON.stringify(data);
}

function loadState(): AppState {
    const dataStr = localStorage[lsKey];
    if (!dataStr) return undefined;

    const data: AppStateSaved = JSON.parse(dataStr);

    // If we change the saved data format, run the saved data through
    // an upgrade check to see if it's an old version of the app.
    // switch (data.__version) {
    //     case 1:
    //         // Upgrade to version 2
    // }

    delete data.__version;

    return <AppState>data;
}

export function saveStateMetaReducer(reducer: ActionReducer<AppState, Action>) {
    let firstRun = true;

    return (state: AppState, action: Action): AppState => {
        const nextState = reducer(state, action);

        if (firstRun) {
            firstRun = false;
            
            // If we have saved state, merge it into the initial state.
            const savedState = loadState();
            if (savedState) {
                // Overwrite defaults with the saved state.
                merge(nextState, savedState);
            }
        } else {
            saveState(nextState);
        }

        return nextState;
    }
}
