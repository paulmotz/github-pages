import { Knight } from './knight';
import { initializeBoard } from '../helpers';
import { hasMatchingMoves } from '../testingHelpers';
import { PieceProps } from '@/lib/types';

describe('knight', () => {
	describe('constructor', () => {
		it('should instantiate a new knight', () => {
			const knightParams: PieceProps = {
				color        : 'white',
				abbreviation : 'K',
				rank         : 1,
				file         : 3,
				id           : 0,
			};
			const knight = new Knight(knightParams);

			expect(knight).toBeInstanceOf(Knight);
		});
	});

	describe('moves', () => {
		it('should return an empty array for a pinned knight', () => {
			const position = {
				wB : [],
				wN : [],
				wK : [ [2, 3] ],
				wP : [],
				wQ : [ [1, 1] ],
				wR : [ [5, 7] ],
				bB : [],
				bN : [ [6, 6] ],
				bK : [ [8, 8] ],
				bP : [],
				bQ : [],
				bR : [],
			};
			const { allPieces, occupiedSquares } = initializeBoard(position);
			const knight = allPieces.bN[0];
			const expectedMoves: number[][] = [];

			const knightMoves = knight.moves({ occupiedSquares });
			hasMatchingMoves(knightMoves, expectedMoves);
		});

		it('should return all moves if all are possible', () => {
			const position = {
				wB : [],
				wN : [ [4, 4] ],
				wK : [ [2, 2] ],
				wP : [],
				wQ : [],
				wR : [ [1, 8] ],
				bB : [],
				bN : [],
				bK : [ [8, 8] ],
				bP : [],
				bQ : [],
				bR : [],
			};
			const { allPieces, occupiedSquares } = initializeBoard(position);
			const knight = allPieces.wN[0];
			const expectedMoves: number[][] = [
				[3, 2],
				[2, 3],
				[2, 5],
				[3, 6],
				[5, 6],
				[6, 5],
				[6, 3],
				[5, 2],
			];

			const knightMoves = knight.moves({ occupiedSquares });
			hasMatchingMoves(knightMoves, expectedMoves);
		});

		it('should return moves for squares do not have a piece of the same color on them', () => {
			const position = {
				wB : [ [3, 2] ],
				wN : [ [4, 4] ],
				wK : [ [2, 2] ],
				wP : [ [5, 6] ],
				wQ : [],
				wR : [ [1, 8] ],
				bB : [],
				bN : [],
				bK : [ [8, 8] ],
				bP : [],
				bQ : [],
				bR : [],
			};
			const { allPieces, occupiedSquares } = initializeBoard(position);
			const knight = allPieces.wN[0];
			const expectedMoves: number[][] = [
				[2, 3],
				[2, 5],
				[3, 6],
				[6, 5],
				[6, 3],
				[5, 2],
			];

			const knightMoves = knight.moves({ occupiedSquares });
			hasMatchingMoves(knightMoves, expectedMoves);
		});

		it('should return only moves that are on the board', () => {
			const position = {
				wB : [],
				wN : [ [1, 1] ],
				wK : [ [2, 2] ],
				wP : [],
				wQ : [],
				wR : [ [1, 8] ],
				bB : [],
				bN : [],
				bK : [ [8, 8] ],
				bP : [],
				bQ : [],
				bR : [],
			};
			const { allPieces, occupiedSquares } = initializeBoard(position);
			const knight = allPieces.wN[0];
			const expectedMoves: number[][] = [
				[2, 3],
				[3, 2],
			];

			const knightMoves = knight.moves({ occupiedSquares });
			hasMatchingMoves(knightMoves, expectedMoves);
		});
	});
});
