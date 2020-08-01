import { PuzzleColor } from 'src/enums/PuzzleColor';

export const puzzlesFeatureKey = 'puzzlesFeature';

export interface IPuzzleCell {
    num: number | undefined;
    isError?: boolean;
    isGuessMode?: boolean;
    isSelected?: boolean;
    isStarterVal: boolean;
    guesses: {
        // Using explicit numbers here to get correct typing.
        1?: { color: PuzzleColor };
        2?: { color: PuzzleColor };
        3?: { color: PuzzleColor };
        4?: { color: PuzzleColor };
        5?: { color: PuzzleColor };
        6?: { color: PuzzleColor };
        7?: { color: PuzzleColor };
        8?: { color: PuzzleColor };
        9?: { color: PuzzleColor };
    };
    // Caching row and column because they never change and it saves us having to look them up.
    row: number;
    col: number;
}

export interface IPuzzle {
    guessColor: PuzzleColor;
    hasWon?: boolean;
    id: string,
    rows: IPuzzleCell[][],
    selectedCell: {
        row: number,
        col: number
    };
    showingAllNum: number;
}

export interface IPuzzlesState {
    puzzles: {[id: string]: IPuzzle};
    activePuzzleId: string;
}
