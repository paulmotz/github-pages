import { Bishop } from './bishop';
import { initializeBoard } from '../helpers'; 
import { PieceProps } from '@/lib/types';

describe('bishop', () => {
	describe('constructor', () => {
		it('should instantiate a new bishop', () => {
			const bishopParams: PieceProps = {
				color        : 'white',
				abbreviation : 'B',
				rank         : 1,
				file         : 3,
				id           : 0,
			};
			const bishop = new Bishop(bishopParams);

			expect(bishop).toBeInstanceOf(Bishop);
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
			const bishop = allPieces.wB[0] as Bishop;
			bishop.rangedMoves = jest.fn();

			bishop.moves({ occupiedSquares });

			expect(bishop.rangedMoves).toHaveBeenCalledTimes(1);
			expect(bishop.rangedMoves).toHaveBeenCalledWith(bishop._bishopDirections, occupiedSquares);
		});
	});

	describe('protectedSquares', () => {
		it('should call rangedProtectedSquares from the parent class', () => {
			const { allPieces, occupiedSquares } = initializeBoard();
			const bishop = allPieces.bB[1] as Bishop;
			bishop.rangedProtectedSquares = jest.fn();

			bishop.protectedSquares(occupiedSquares);

			expect(bishop.rangedProtectedSquares).toHaveBeenCalledTimes(1);
			expect(bishop.rangedProtectedSquares).toHaveBeenCalledWith(bishop._bishopDirections, occupiedSquares);
		});
	});
});
