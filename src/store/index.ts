import { puzzlesFeatureKey, IPuzzlesState } from 'src/store/puzzle/types';

export interface AppState {
    [puzzlesFeatureKey]: IPuzzlesState;
}
