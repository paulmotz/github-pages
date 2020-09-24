export const hasMovesLogic = (allMoves: number[][], expectedMoves: number[][]): boolean => {
	return expectedMoves.every(expectedMove => {
		for (const move of allMoves) {
			if (expectedMove[0] === move[0] && expectedMove[1] === move[1]) {
				return true;
			}
		}

		return false;
	});
};

export const hasMoves = (allMoves: number[][], expectedMoves: number[][]): void => {
	const hasAllMoves = hasMovesLogic(allMoves, expectedMoves);

	expect(hasAllMoves).toBe(true);
};

export const sortByRankAndFile = (arr: number[][]): number[][] => {
	// sort moves by rank, then file
	return arr.sort((a, b) => {
		if (a[0] < b[0]) {
			return -1;
		} else if (a[0] > b[0]) {
			return 1;
		} else if (a[1] < b[1]) {
			return -1;
		} else if (a[1] > b[1]) {
			return 1;
		}

		return 0;
	});
};

interface SortedMoves {
	[key: string]: number[][];
}

export const hasMatchingMovesLogic = (moves: number[][], expectedMoves: number[][]): SortedMoves => {
	const sortedMoves = sortByRankAndFile(moves);
	const sortedExpectedMoves = sortByRankAndFile(expectedMoves);

	return { sortedMoves, sortedExpectedMoves };
};

export const hasMatchingMoves = (moves: number[][], expectedMoves: number[][]): void => {
	const { sortedMoves, sortedExpectedMoves } = hasMatchingMovesLogic(moves, expectedMoves);

	expect(sortedMoves).toEqual(sortedExpectedMoves);
};