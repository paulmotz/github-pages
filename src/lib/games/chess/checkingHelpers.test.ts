import { getCheckingPath } from './checkingHelpers';

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
			
			const checkingPath = getCheckingPath(checkingPieceLocation, kingLocation);

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
			
			const checkingPath = getCheckingPath(checkingPieceLocation, kingLocation);

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
			
			const checkingPath = getCheckingPath(checkingPieceLocation, kingLocation);

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
			
			const checkingPath = getCheckingPath(checkingPieceLocation, kingLocation);

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
			
			const checkingPath = getCheckingPath(checkingPieceLocation, kingLocation);

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
			
			const checkingPath = getCheckingPath(checkingPieceLocation, kingLocation);

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
			
			const checkingPath = getCheckingPath(checkingPieceLocation, kingLocation);

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
			
			const checkingPath = getCheckingPath(checkingPieceLocation, kingLocation);

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
			
			const checkingPath = getCheckingPath(checkingPieceLocation, kingLocation);

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
			
			expect(() => getCheckingPath(checkingPieceLocation, kingLocation)).toThrow('invalid check path');
		});
	});
});
