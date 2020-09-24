import { King } from './king';
import { initializeBoard } from '../helpers';
import { hasMoves } from '../testingHelpers';
import { PieceProps } from '@/lib/types';

describe('king', () => {
	describe('constructor', () => {
		it('should instantiate a new king', () => {
			const kingParams: PieceProps = {
				color        : 'white',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			};
			const king = new King(kingParams);

			expect(king).toBeInstanceOf(King);
		});
	});

	describe('hasMoved', () => {
		it('should default to false', () => {
			const kingParams: PieceProps = {
				color        : 'white',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			};

			const king = new King(kingParams);

			expect(king.hasMoved).toBe(false);
		});

		it('should be able to be set', () => {
			const kingParams: PieceProps = {
				color        : 'white',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			};

			const king = new King(kingParams);

			king.hasMoved = true;

			expect(king.hasMoved).toBe(true);
		});
	});

	describe('moves', () => {
		it('should include kingside castling', () => {
			// HACK: Should not have to have both rooks for kingside castling
			const position = {
				wB : [],
				wN : [],
				wK : [ [1, 5] ],
				wP : [],
				wQ : [ [1, 4] ],
				wR : [ [1, 1], [1, 8] ],
				bB : [],
				bN : [ [6, 6] ],
				bK : [ [8, 8] ],
				bP : [],
				bQ : [],
				bR : [],
			};
			const { allPieces, occupiedSquares } = initializeBoard(position);
			const king = allPieces.wK[0];
			const expectedMoves: number[][] = [
				[1, 6],
				[1, 7],
			];

			const kingMoves = king.moves({ allPieces, occupiedSquares });
			hasMoves(kingMoves, expectedMoves);
		});

		it('should include queenside castling', () => {
			const position = {
				wB : [],
				wN : [],
				wK : [ [1, 5] ],
				wP : [],
				wQ : [],
				wR : [ [1, 1]],
				bB : [],
				bN : [ [6, 6] ],
				bK : [ [8, 8] ],
				bP : [],
				bQ : [],
				bR : [],
			};
			const { allPieces, occupiedSquares } = initializeBoard(position);
			const king = allPieces.wK[0];
			const expectedMoves: number[][] = [
				[1, 4],
				[1, 3],
			];

			const kingMoves = king.moves({ allPieces, occupiedSquares });
			hasMoves(kingMoves, expectedMoves);
		});
	});
});
