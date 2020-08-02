import { PuzzleColor } from 'src/enums/PuzzleColor';

export const puzzlesFeatureKey = 'puzzlesFeature';

export interface IPuzzleGuess {
    color: PuzzleColor;
}

export interface IPuzzleCell {
    num: number | undefined;
    isError?: boolean;
    isGuessMode?: boolean;
    isSelected?: boolean;
    isStarterVal: boolean;
    guesses: {
        // Using explicit numbers here to get correct typing.
        1?: IPuzzleGuess;
        2?: IPuzzleGuess;
        3?: IPuzzleGuess;
        4?: IPuzzleGuess;
        5?: IPuzzleGuess;
        6?: IPuzzleGuess;
        7?: IPuzzleGuess;
        8?: IPuzzleGuess;
        9?: IPuzzleGuess;
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
