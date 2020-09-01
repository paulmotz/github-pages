import { getCheckingPath, isSquareAttacked, removeAttackedSquares } from './checkingHelpers';

describe('checkingHelpers', () => {
	describe('getCheckingPath', () => {
		it('should return the correct path when the piece is checking from below', () => {
			const checkingPieceLocation = {
				rank : 1,
				file : 5,
			};
			const kingLocation = {
				rank : 8,
				file : 5,
			};
			const expectedResult = [
				[ 2, 5 ],
				[ 3, 5 ],
				[ 4, 5 ],
				[ 5, 5 ],
				[ 6, 5 ],
				[ 7, 5 ],
			];
			
			const checkingPath = getCheckingPath(checkingPieceLocation, kingLocation, false);

			expect(checkingPath).toEqual(expectedResult);
		});

		it('should return the correct path when the piece is checking from above', () => {
			const checkingPieceLocation = {
				rank : 5,
				file : 4,
			};
			const kingLocation = {
				rank : 1,
				file : 4,
			};
			const expectedResult = [
				[ 4, 4 ],
				[ 3, 4 ],
				[ 2, 4 ],
			];
			
			const checkingPath = getCheckingPath(checkingPieceLocation, kingLocation, false);

			expect(checkingPath).toEqual(expectedResult);
		});

		it('should return the correct path when the piece is checking from the left', () => {
			const checkingPieceLocation = {
				rank : 3,
				file : 6,
			};
			const kingLocation = {
				rank : 3,
				file : 8,
			};
			const expectedResult = [
				[ 3, 7 ],
			];
			
			const checkingPath = getCheckingPath(checkingPieceLocation, kingLocation, false);

			expect(checkingPath).toEqual(expectedResult);
		});

		it('should return the correct path when the piece is checking from the right', () => {
			const checkingPieceLocation = {
				rank : 1,
				file : 7,
			};
			const kingLocation = {
				rank : 1,
				file : 2,
			};
			const expectedResult = [
				[ 1, 6 ],
				[ 1, 5],
				[ 1, 4 ],
				[ 1, 3 ],
			];
			
			const checkingPath = getCheckingPath(checkingPieceLocation, kingLocation, false);

			expect(checkingPath).toEqual(expectedResult);
		});

		it('should return the correct path when the piece is checking from the top left', () => {
			const checkingPieceLocation = {
				rank : 8,
				file : 1,
			};
			const kingLocation = {
				rank : 1,
				file : 8,
			};
			const expectedResult = [
				[ 7, 2 ],
				[ 6, 3 ],
				[ 5, 4 ],
				[ 4, 5 ],
				[ 3, 6 ],
				[ 2, 7 ],
			];
			
			const checkingPath = getCheckingPath(checkingPieceLocation, kingLocation, false);

			expect(checkingPath).toEqual(expectedResult);
		});

		it('should return the correct path when the piece is checking from the top right', () => {
			const checkingPieceLocation = {
				rank : 4,
				file : 6,
			};
			const kingLocation = {
				rank : 6,
				file : 8,
			};
			const expectedResult = [
				[ 5, 7 ],
			];
			
			const checkingPath = getCheckingPath(checkingPieceLocation, kingLocation, false);

			expect(checkingPath).toEqual(expectedResult);
		});

		it('should return the correct path when the piece is checking from the bottom right', () => {
			const checkingPieceLocation = {
				rank : 8,
				file : 3,
			};
			const kingLocation = {
				rank : 4,
				file : 7,
			};
			const expectedResult = [
				[ 7, 4 ],
				[ 6, 5 ],
				[ 5, 6 ],
			];
			
			const checkingPath = getCheckingPath(checkingPieceLocation, kingLocation, false);

			expect(checkingPath).toEqual(expectedResult);
		});

		it('should return the correct path when the piece is checking from the bottom left', () => {
			const checkingPieceLocation = {
				rank : 6,
				file : 6,
			};
			const kingLocation = {
				rank : 2,
				file : 2,
			};
			const expectedResult = [
				[ 5, 5 ],
				[ 4, 4 ],
				[ 3, 3 ],
			];
			
			const checkingPath = getCheckingPath(checkingPieceLocation, kingLocation, false);

			expect(checkingPath).toEqual(expectedResult);
		});

		it('should return an empty array when the checking piece is adjacent to the king', () => {
			const checkingPieceLocation = {
				rank : 6,
				file : 6,
			};
			const kingLocation = {
				rank : 6,
				file : 7,
			};
			const expectedResult: number[][] = [];
			
			const checkingPath = getCheckingPath(checkingPieceLocation, kingLocation, false);

			expect(checkingPath).toEqual(expectedResult);
		});

		it('should throw an error when an invalid check path is passed in', () => {
			const checkingPieceLocation = {
				rank : 6,
				file : 6,
			};
			const kingLocation = {
				rank : 2,
				file : 4,
			};
			
			expect(() => getCheckingPath(checkingPieceLocation, kingLocation, false)).toThrow('invalid check path');
		});
	});

	describe('isSquareAttacked', () => {
		it('should return true when the square is part of the attackedSquares array', () => {
			const square = [2, 4];
			const attackedSquares = [
				[ 1, 2 ],
				[ 2, 4 ],
			];

			expect(isSquareAttacked(square, attackedSquares)).toBe(true);
		});

		it('should return false when the square is part of the attackedSquares array', () => {
			const square = [3, 4];
			const attackedSquares = [
				[ 1, 2 ],
				[ 2, 4 ],
			];

			expect(isSquareAttacked(square, attackedSquares)).toBe(false);
		});
	});

	describe('removeAttackedSquares', () => {
		it('should not return entries present in both arrays', () => {
			const moves = [
				[8, 6],
				[8, 5],
			];
			const attackedSquares = [
				[ 6, 4 ],
				[ 8, 6 ],
				[ 3, 5 ],
				[ 4, 5 ],
				[ 5, 5 ],
				[ 6, 5 ],
			];
			const expectedLegalSquares = [
				[8, 5],
			];

			const legalMoves = removeAttackedSquares(moves, attackedSquares);

			expect(legalMoves).toEqual(expectedLegalSquares);
		});

		it('should be able to return an empty array when there all moves are in', () => {
			const moves = [
				[8, 6],
				[8, 5],
			];
			const attackedSquares = [
				[ 6, 4 ],
				[ 8, 6 ],
				[ 3, 5 ],
				[ 4, 5 ],
				[ 5, 5 ],
				[ 6, 5 ],
				[ 8, 5 ],
			];
			const expectedLegalSquares: number[][] = [];

			const legalMoves = removeAttackedSquares(moves, attackedSquares);

			expect(legalMoves).toEqual(expectedLegalSquares);
		});

		it('should return the moves when there is no overlap between moves and attackedSquares', () => {
			const moves = [
				[8, 6],
				[8, 5],
			];
			const attackedSquares = [
				[ 1, 2 ],
				[ 3, 4 ],
			];
			const expectedLegalSquares = [
				[8, 6],
				[8, 5],
			];

			const legalMoves = removeAttackedSquares(moves, attackedSquares);

			expect(legalMoves).toEqual(expectedLegalSquares);
		});
	});
});
