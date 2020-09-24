import { Rook } from './rook';
import { initializeBoard } from '../helpers'; 
import { PieceProps } from '@/lib/types';

describe('rook', () => {
	describe('constructor', () => {
		it('should instantiate a new rook', () => {
			const rookParams: PieceProps = {
				color        : 'white',
				abbreviation : 'R',
				rank         : 1,
				file         : 3,
				id           : 0,
			};
			const rook = new Rook(rookParams);

			expect(rook).toBeInstanceOf(Rook);
		});
	});

	describe('hasMoved', () => {
		it('should default to false', () => {
			const rookParams: PieceProps = {
				color        : 'white',
				abbreviation : 'R',
				rank         : 1,
				file         : 3,
				id           : 0,
			};

			const rook = new Rook(rookParams);

			expect(rook.hasMoved).toBe(false);
		});

		it('should be able to be set', () => {
			const rookParams: PieceProps = {
				color        : 'white',
				abbreviation : 'R',
				rank         : 1,
				file         : 3,
				id           : 0,
			};
			const rook = new Rook(rookParams);

			rook.hasMoved = true;

			expect(rook.hasMoved).toBe(true);
		});
	});

	describe('moves', () => {
		it('should call rangedMoves from the parent class and return its result', () => {
			const position = {
				wB : [ [1, 3], [1, 6] ],
				wN : [ [1, 2], [1, 7] ],
				wK : [ [1, 5] ],
				wP : [ [2, 1], [2, 2], [2, 3], [4, 4], [2, 5], [2, 6], [2, 7], [2, 8] ],
				wQ : [ [1, 4] ],
				wR : [ [1, 1], [1, 8] ],
				bB : [ [8, 3], [8, 6] ],
				bN : [ [8, 2], [8, 7] ],
				bK : [ [8, 5] ] ,
				bP : [ [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7], [7, 8] ],
				bQ : [ [8, 4] ],
				bR : [ [8, 1], [8, 8] ],
			};
			const { allPieces, occupiedSquares } = initializeBoard(position);
			const rook = allPieces.wR[0] as Rook;
			rook.rangedMoves = jest.fn();

			rook.moves({ occupiedSquares });

			expect(rook.rangedMoves).toHaveBeenCalledTimes(1);
			expect(rook.rangedMoves).toHaveBeenCalledWith(rook._rookDirections, occupiedSquares);
		});
	});

	describe('protectedSquares', () => {
		it('should call rangedProtectedSquares from the parent class', () => {
			const { allPieces, occupiedSquares } = initializeBoard();
			const rook = allPieces.bR[0] as Rook;
			rook.rangedProtectedSquares = jest.fn();

			rook.protectedSquares(occupiedSquares);

			expect(rook.rangedProtectedSquares).toHaveBeenCalledTimes(1);
			expect(rook.rangedProtectedSquares).toHaveBeenCalledWith(rook._rookDirections, occupiedSquares);
		});
	});
});
