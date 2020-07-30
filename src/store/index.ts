import { IPuzzlesState } from 'src/store/puzzle/types';
import * as fromPuzzles from 'src/store/puzzle/reducers/puzzle.reducer';

export interface AppState {
    [fromPuzzles.featureKey]: IPuzzlesState;
}
