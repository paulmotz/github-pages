import { Pawn } from './pawn';
import { initializeBoard } from '../helpers'; 
import { PieceProps } from '@/lib/types';

const hasMatchingMoves = (moves: number[][], expectedMoves: number[][]): void => {
	// sort moves by rank, then file
	const sortByRankAndFile = (arr: number[][]): number[][] => {
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
	
	const sortedMoves = sortByRankAndFile(moves);
	const sortedExpectedMoves = sortByRankAndFile(expectedMoves);

	expect(sortedMoves).toEqual(sortedExpectedMoves);
};

describe('pawn', () => {
	describe('constructor', () => {
		it('should instantiate a new pawn', () => {
			const pawnParams: PieceProps = {
				color        : 'white',
				abbreviation : 'P',
				rank         : 2,
				file         : 1,
				id           : 0,
			};
			const pawn = new Pawn(pawnParams);

			expect(pawn).toBeInstanceOf(Pawn);
		});
	});


	describe('moves', () => {
		it('a white pawn on the second rank should be able to move up one or two squares', () => {
			const { allPieces, occupiedSquares } = initializeBoard();
			const pawn = allPieces.wP[0];
			const expectedMoves = [
				[pawn.rank + 1, pawn.file],
				[pawn.rank + 2, pawn.file],
			];
			
			const pawnMoves = pawn.moves({ occupiedSquares });
			hasMatchingMoves(pawnMoves, expectedMoves);
		});

		it('a white pawn not on the second rank should be able to move up one square', () => {
			const { allPieces, occupiedSquares } = initializeBoard();
			const pawn = allPieces.wP[0];
			pawn.rank = 3;
			const expectedMoves = [
				[pawn.rank + 1, pawn.file],
			];

			const pawnMoves = pawn.moves({ occupiedSquares });
			hasMatchingMoves(pawnMoves, expectedMoves);
		});

		it('a white pawn should be able to capture sqaures diagonally going up', () => {
			const position = {
				wB : [],
				wN : [],
				wK : [ [1, 5] ],
				wP : [ [3, 3] ],
				wQ : [],
				wR : [],
				bB : [ [4, 4] ],
				bN : [],
				bK : [ [8, 5] ],
				bP : [],
				bQ : [],
				bR : [ [4, 2] ],
			};
			const { allPieces, occupiedSquares } = initializeBoard(position);
			const pawn = allPieces.wP[0];
			const expectedMoves = [
				[pawn.rank + 1, pawn.file - 1],
				[pawn.rank + 1, pawn.file],
				[pawn.rank + 1, pawn.file + 1],
			];

			const pawnMoves = pawn.moves({ occupiedSquares });
			hasMatchingMoves(pawnMoves, expectedMoves);
		});

		it('a white pawn should not be able to move up if a white piece is in its way', () => {
			const position = {
				wB : [],
				wN : [ [4, 3] ],
				wK : [ [1, 5] ],
				wP : [ [3, 3] ],
				wQ : [],
				wR : [],
				bB : [],
				bN : [],
				bK : [ [7, 7] ],
				bP : [],
				bQ : [],
				bR : [],
			};
			const { allPieces, occupiedSquares } = initializeBoard(position);
			const pawn = allPieces.wP[0];
			const expectedMoves: number[][] = [];

			const pawnMoves = pawn.moves({ occupiedSquares });
			hasMatchingMoves(pawnMoves, expectedMoves);
		});

		it('a white pawn should not be able to move up if a black piece is in its way', () => {
			const position = {
				wB : [],
				wN : [],
				wK : [ [1, 5] ],
				wP : [ [3, 3] ],
				wQ : [],
				wR : [],
				bB : [],
				bN : [ [4, 3] ],
				bK : [ [7, 7] ],
				bP : [],
				bQ : [],
				bR : [],
			};
			const { allPieces, occupiedSquares } = initializeBoard(position);
			const pawn = allPieces.wP[0];
			const expectedMoves: number[][] = [];

			const pawnMoves = pawn.moves({ occupiedSquares });
			hasMatchingMoves(pawnMoves, expectedMoves);
		});

		it('a white pawn on the second rank should not be able to move up two square if it would move to an occupied square', () => {
			const position = {
				wB : [],
				wN : [],
				wK : [ [1, 5] ],
				wP : [ [2, 3] ],
				wQ : [],
				wR : [],
				bB : [],
				bN : [ [4, 3] ],
				bK : [ [7, 7] ],
				bP : [],
				bQ : [],
				bR : [],
			};
			const { allPieces, occupiedSquares } = initializeBoard(position);
			const pawn = allPieces.wP[0];
			const expectedMoves = [ [3, 3] ];

			const pawnMoves = pawn.moves({ occupiedSquares });
			hasMatchingMoves(pawnMoves, expectedMoves);
		});
		
		it('a black pawn on the seventh rank should be able to move down one or two squares', () => {
			const { allPieces, occupiedSquares } = initializeBoard();
			const pawn = allPieces.bP[0];
			const expectedMoves = [
				[pawn.rank - 1, pawn.file],
				[pawn.rank - 2, pawn.file],
			];
			
			const pawnMoves = pawn.moves({ occupiedSquares });
			hasMatchingMoves(pawnMoves, expectedMoves);
		});

		it('a black pawn not on the seventh rank should be able to move down one square', () => {
			const { allPieces, occupiedSquares } = initializeBoard();
			const pawn = allPieces.bP[0];
			pawn.rank = 6;
			const expectedMoves = [
				[pawn.rank - 1, pawn.file],
			];

			const pawnMoves = pawn.moves({ occupiedSquares });
			hasMatchingMoves(pawnMoves, expectedMoves);
		});

		it('a black pawn should be able to capture sqaures diagonally going up', () => {
			const position = {
				wB : [],
				wN : [ [5, 1] ],
				wK : [ [1, 5] ],
				wP : [ [5, 3] ],
				wQ : [],
				wR : [],
				bB : [],
				bN : [],
				bK : [ [8, 5] ],
				bP : [ [6, 2] ],
				bQ : [],
				bR : [],
			};
			const { allPieces, occupiedSquares } = initializeBoard(position);
			const pawn = allPieces.bP[0];
			const expectedMoves = [
				[pawn.rank - 1, pawn.file - 1],
				[pawn.rank - 1, pawn.file],
				[pawn.rank - 1, pawn.file + 1],
			];

			const pawnMoves = pawn.moves({ occupiedSquares });
			hasMatchingMoves(pawnMoves, expectedMoves);
		});

		it('a black pawn should not be able to move down if a black piece is in its way', () => {
			const position = {
				wB : [],
				wN : [],
				wK : [ [1, 5] ],
				wP : [ [3, 3] ],
				wQ : [],
				wR : [],
				bB : [],
				bN : [ [4, 3] ],
				bK : [ [6, 8] ],
				bP : [ [6, 6] ],
				bQ : [ [5, 6] ],
				bR : [],
			};
			const { allPieces, occupiedSquares } = initializeBoard(position);
			const pawn = allPieces.bP[0];
			const expectedMoves: number[][] = [];

			const pawnMoves = pawn.moves({ occupiedSquares });
			hasMatchingMoves(pawnMoves, expectedMoves);
		});

		it('a black pawn should not be able to move down if a white piece is in its way', () => {
			const position = {
				wB : [],
				wN : [],
				wK : [ [1, 5] ],
				wP : [ [3, 3] ],
				wQ : [],
				wR : [],
				bB : [],
				bN : [],
				bK : [ [8, 2] ],
				bP : [ [4, 3] ],
				bQ : [],
				bR : [],
			};
			const { allPieces, occupiedSquares } = initializeBoard(position);
			const pawn = allPieces.bP[0];
			const expectedMoves: number[][] = [];

			const pawnMoves = pawn.moves({ occupiedSquares });
			hasMatchingMoves(pawnMoves, expectedMoves);
		});

		it('a black pawn on the seventh rank should not be able to move up two square if it would move to an occupied square', () => {
			const position = {
				wB : [],
				wN : [],
				wK : [ [1, 5] ],
				wP : [ [2, 3] ],
				wQ : [],
				wR : [],
				bB : [],
				bN : [ [5, 3] ],
				bK : [ [7, 7] ],
				bP : [ [7, 3] ],
				bQ : [],
				bR : [],
			};
			const { allPieces, occupiedSquares } = initializeBoard(position);
			const pawn = allPieces.bP[0];
			const expectedMoves = [ [6, 3] ];

			const pawnMoves = pawn.moves({ occupiedSquares });
			hasMatchingMoves(pawnMoves, expectedMoves);
		});

		it('a horizontally pinned pawn should not be able to move', () => {
			const position = {
				wB : [],
				wN : [],
				wK : [ [2, 2] ],
				wP : [ [3, 2] ],
				wQ : [],
				wR : [],
				bB : [],
				bN : [],
				bK : [ [8, 2] ],
				bP : [],
				bQ : [],
				bR : [ [4, 2] ],
			};
			const { allPieces, occupiedSquares } = initializeBoard(position);
			const pawn = allPieces.wP[0];
			const expectedMoves: number[][] = [];

			const pawnMoves = pawn.moves({ occupiedSquares });
			hasMatchingMoves(pawnMoves, expectedMoves);
		});
	});
});
