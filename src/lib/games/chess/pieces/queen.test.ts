import { Queen } from './queen';
import { initializeBoard } from '../helpers'; 
import { PieceProps } from '@/lib/types';

describe('queen', () => {
	const queenParams: PieceProps = {
		color        : 'white',
		abbreviation : 'Q',
		rank         : 1,
		file         : 3,
		id           : 0,
	};

	describe('constructor', () => {
		it('should instantiate a new queen', () => {

			const queen = new Queen(queenParams);

			expect(queen).toBeInstanceOf(Queen);
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
			const queen = allPieces.wQ[0] as Queen;
			queen.rangedMoves = jest.fn();

			queen.moves({ occupiedSquares });

			expect(queen.rangedMoves).toHaveBeenCalledTimes(1);
			expect(queen.rangedMoves).toHaveBeenCalledWith(queen._queenDirections, occupiedSquares);
		});
	});

	describe('protectedSquares', () => {
		it('should call rangedProtectedSquares from the parent class', () => {
			const { allPieces, occupiedSquares } = initializeBoard();
			const queen = allPieces.bQ[0] as Queen;
			queen.rangedProtectedSquares = jest.fn();

			queen.protectedSquares(occupiedSquares);

			expect(queen.rangedProtectedSquares).toHaveBeenCalledTimes(1);
			expect(queen.rangedProtectedSquares).toHaveBeenCalledWith(queen._queenDirections, occupiedSquares);
		});
	});
});
