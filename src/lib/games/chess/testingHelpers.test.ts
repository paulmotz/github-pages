import { hasMovesLogic, hasMatchingMovesLogic } from './testingHelpers';

describe('testingHelpers', () => {
	describe('hasMovesLogic', () => {
		it('should return true when all expected moves are contained in the moves', () => {
			const allMoves = [
				[1, 1],
				[2, 3],
				[5, 3],
				[7, 4],
				[8, 2],
			];
			const expectedMoves = [
				[1, 1],
				[2, 3],
				[7, 4],
			];

			const hasMovesResult = hasMovesLogic(allMoves, expectedMoves);

			expect(hasMovesResult).toBe(true);
		});

		it('should return false when all not all expected moves are contained in the moves', () => {
			const allMoves = [
				[1, 1],
				[2, 3],
				[5, 3],
				[7, 4],
				[8, 2],
			];
			const expectedMoves = [
				[1, 1],
				[2, 3],
				[7, 4],
				[8, 8],
			];

			const hasMovesResult = hasMovesLogic(allMoves, expectedMoves);

			expect(hasMovesResult).toBe(false);
		});
	});

	describe('hasMatchingMovesLogic', () => {
		it('should return true when the two arrays of moves are identical', () => {
			const allMoves = [
				[1, 1],
				[2, 3],
				[5, 3],
				[7, 4],
				[8, 2],
			];
			const expectedMoves = [
				[2, 3],
				[8, 2],
				[7, 4],
				[5, 3],
				[1, 1],
			];

			const { sortedMoves, sortedExpectedMoves } = hasMatchingMovesLogic(allMoves, expectedMoves);

			expect(sortedMoves).toEqual(sortedExpectedMoves);
		});

		it('should return false when there are additional moves', () => {
			const allMoves = [
				[1, 1],
				[2, 3],
				[5, 3],
				[7, 4],
				[8, 2],
			];
			const expectedMoves = [
				[2, 3],
				[8, 2],
				[7, 4],
				[5, 3],
			];

			const { sortedMoves, sortedExpectedMoves } = hasMatchingMovesLogic(allMoves, expectedMoves);

			expect(sortedMoves).not.toEqual(sortedExpectedMoves);
		});

		it('should return false when there are additional moves', () => {
			const allMoves = [
				[1, 1],
				[2, 3],
				[5, 3],
			];
			const expectedMoves = [
				[2, 3],
				[8, 2],
				[7, 4],
				[5, 3],
				[1, 1],
			];

			const { sortedMoves, sortedExpectedMoves } = hasMatchingMovesLogic(allMoves, expectedMoves);

			expect(sortedMoves).not.toEqual(sortedExpectedMoves);
		});

		it('should return false when the sets of moves are different', () => {
			const allMoves = [
				[1, 1],
				[4, 3],
				[5, 3],
				[7, 4],
				[8, 2],
			];
			const expectedMoves = [
				[2, 3],
				[8, 2],
				[7, 4],
				[5, 3],
				[1, 3],
			];

			const { sortedMoves, sortedExpectedMoves } = hasMatchingMovesLogic(allMoves, expectedMoves);

			expect(sortedMoves).not.toEqual(sortedExpectedMoves);
		});
	});
});