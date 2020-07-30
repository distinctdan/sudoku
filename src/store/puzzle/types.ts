import { PuzzleColor } from 'src/enums/PuzzleColor';

export interface IPuzzleCell {
    num: number | undefined;
    isError?: boolean;
    isGuessMode?: boolean;
    isSelected?: boolean;
    isStarterVal: boolean;
    // 1-based array of 10 items. We're ignoring the 0th slot.
    // So if the user guess "1", we'll set a guess object at index[1];
    guesses: Array<{
        color: PuzzleColor;
    }>;
}

export interface IPuzzle {
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