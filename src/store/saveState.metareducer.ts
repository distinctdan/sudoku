import { Action, ActionReducer } from '@ngrx/store';
import { merge } from 'lodash';
import { AppState } from 'src/store/index';
import { IPuzzleGuess, puzzlesFeatureKey } from 'src/store/puzzle';
import { PuzzleColor } from 'src/enums';

interface AppStateSaved extends AppState {
    __version: number,
}

const lsKey = 'sudokuAppState';
const version = 3;

// If we change the saved data format, run the saved data through
// an upgrade check to migrate the data.
function migrateState(state: AppStateSaved): AppStateSaved {
    switch (state.__version) {
        case 2:
            // Changed Green to Yellow
            for (const [_, puzzle] of Object.entries(state[puzzlesFeatureKey].puzzles)) {
                for (const row of puzzle.rows) {
                    for (const cell of row) {
                        for (const [_, guess] of Object.entries(cell.guesses)) {
                            if (guess.color as any === 'Green') {
                                guess.color = PuzzleColor.Yellow;
                            }
                        }
                    }
                }
            }
        // Fallthrough
        case 3:
            break;
    }
    return state;
}

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

    const state: AppStateSaved = JSON.parse(dataStr);

    if (state.__version !== version) {
        migrateState(state);
    }

    delete state.__version;
    return <AppState>state;
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
