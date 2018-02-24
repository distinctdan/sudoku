module Sudoku {
	'use strict';

	export interface ICell {
        bigNum: number;
        showingBigNum: boolean;
        smallNums: boolean[];
        isSelected: boolean;
        state: Enums.CellState;
    }
}