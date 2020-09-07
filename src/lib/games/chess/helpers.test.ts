import { isSquareOnBoard, removeDuplicates, getOtherColor, getPieceColor } from './helpers';

describe('helpers', () => {
	describe('isSquareOnBoard', () => {
		it('should return true for squares on the board', () => {
			expect(isSquareOnBoard([1, 3])).toBe(true);
			expect(isSquareOnBoard([4, 7])).toBe(true);
			expect(isSquareOnBoard([1, 1])).toBe(true);
			expect(isSquareOnBoard([8, 8])).toBe(true);
		});

		it('should return false for squares off the board', () => {
			expect(isSquareOnBoard([-1, 3])).toBe(false);
			expect(isSquareOnBoard([14, 7])).toBe(false);
			expect(isSquareOnBoard([1, 9])).toBe(false);
			expect(isSquareOnBoard([0, 8])).toBe(false);
		});
	});

	describe('getOtherColor', () => {
		it('should return black when white is passed in', () => {
			expect(getOtherColor('white')).toBe('black');
		});

		it('should return white when black is passed in', () => {
			expect(getOtherColor('black')).toBe('white');
		});
	});

	describe('getPieceColor', () => {
		it('should return the correct color for an abbreviation', () => {
			expect(getPieceColor('bB')).toBe('black');
			expect(getPieceColor('bN')).toBe('black');
			expect(getPieceColor('bK')).toBe('black');
			expect(getPieceColor('bP')).toBe('black');
			expect(getPieceColor('bQ')).toBe('black');
			expect(getPieceColor('bR')).toBe('black');
			expect(getPieceColor('wB')).toBe('white');
			expect(getPieceColor('wN')).toBe('white');
			expect(getPieceColor('wK')).toBe('white');
			expect(getPieceColor('wP')).toBe('white');
			expect(getPieceColor('wQ')).toBe('white');
			expect(getPieceColor('wR')).toBe('white');
		});

		it('should throw when an unexpected abbreviation is passed in', () => {
			expect(() => getPieceColor('xx')).toThrow('Unknown color');
		});
	});

	describe('removeDuplicates', () => {
		it('should return remove duplcates from an array', () => {
			const arrayWithDuplicates = [
				[ 1, 3 ],
				[ 2, 3 ],
				[ 1, 3 ],
			];
			const arrayWithoutDuplicates = [
				[ 1, 3 ],
				[ 2, 3 ],
			];
			
			const resultingArray = removeDuplicates(arrayWithDuplicates);

			expect(resultingArray).toEqual(arrayWithoutDuplicates);
		});

		it('should return the initial array when ther are no duplicates', () => {
			const arrayWithoutDuplicates = [
				[ 1, 3 ],
				[ 2, 3 ],
			];
			
			const resultingArray = removeDuplicates(arrayWithoutDuplicates);

			expect(resultingArray).toEqual(arrayWithoutDuplicates);
		});
	});
});
