import { getKingLocation, getKing, getCheckingPieces, getCheckingPath, isSquareAttacked, removeAttackedSquares,  getLegalMoves, isCheckmate } from './checkingHelpers';
import { PieceStartingPositions } from '@/lib/types';
import { initializeBoard } from './helpers';
import { Piece, Pawn, Knight, Rook, Queen, King } from './pieces';

const hasMoves = (moves: number[][], move: number[]): boolean => {
	for (const m of moves) {
		if (m[0] === move[0] && m[1] === move[1]) {
			return true;
		}
	}

	return false;
};

describe('checkingHelpers', () => {
	describe('getKingLocation', () => {
		it('should return the location of the king of the passed in color', () => {
			const whiteKingLocation = {
				rank : 1,
				file : 5,
			};
			const blackKingLocation = {
				rank : 8,
				file : 5,
			};
			const whiteKing = new King({
				color        : 'white',
				abbreviation : 'K',
				rank         : whiteKingLocation.rank,
				file         : whiteKingLocation.file,
				id           : 0,
			});
			const blackKing = new King({
				color        : 'black',
				abbreviation : 'K',
				rank         : blackKingLocation.rank,
				file         : blackKingLocation.file,
				id           : 0,
			});
			
			const allPieces = {
				bK : [ blackKing ],
				wK : [ whiteKing ],
			};

			expect(getKingLocation(allPieces, 'white')).toEqual(whiteKingLocation);
			expect(getKingLocation(allPieces, 'black')).toEqual(blackKingLocation);
		});
	});

	describe('getKing', () => {
		it('should return the king of the passed in color', () => {
			const whiteKing = new King({
				color        : 'white',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});
			const blackKing = new King({
				color        : 'black',
				abbreviation : 'K',
				rank         : 8,
				file         : 5,
				id           : 0,
			});
			
			const allPieces = {
				bK : [ blackKing ],
				wK : [ whiteKing ],
			};

			expect(getKing(allPieces, 'white')).toEqual(whiteKing);
			expect(getKing(allPieces, 'black')).toEqual(blackKing);
		});
	});

	describe('getCheckingPieces', () => {
		it('should return the checking piece when there is one piece giving check', () => {
			const piecePositions: PieceStartingPositions = {
				wK : [ [1, 5] ],
				wR : [ [2, 5] ],
				bK : [ [8, 5] ],
			};

			const { allPieces, occupiedSquares } = initializeBoard(piecePositions);

			const checkingPieces = getCheckingPieces(allPieces, occupiedSquares, 'black');
			expect(checkingPieces).toHaveLength(1);
			expect(checkingPieces[0]).toBeInstanceOf(Rook);
		});

		it('should return the checking piece when there are two pieces giving check', () => {
			const piecePositions: PieceStartingPositions = {
				wK : [ [1, 5] ],
				bQ : [ [6, 5] ],
				bN : [ [3, 4] ],
				bK : [ [8, 5] ],
			};

			const { allPieces, occupiedSquares } = initializeBoard(piecePositions);

			const checkingPieces = getCheckingPieces(allPieces, occupiedSquares, 'white');
			expect(checkingPieces).toHaveLength(2);
			expect(checkingPieces.find(piece => piece instanceof Knight)).toBeDefined();
			expect(checkingPieces.find(piece => piece instanceof Queen)).toBeDefined();
		});

		it('should return the checking piece when there is one piece giving check as part of a battery', () => {
			const piecePositions: PieceStartingPositions = {
				wK : [ [1, 5] ],
				wB : [ [5, 2] ],
				wQ : [ [6, 3] ],
				bK : [ [8, 5] ],
			};

			const { allPieces, occupiedSquares } = initializeBoard(piecePositions);

			const checkingPieces = getCheckingPieces(allPieces, occupiedSquares, 'black');
			expect(checkingPieces).toHaveLength(1);
			expect(checkingPieces[0]).toBeInstanceOf(Queen);
		});

		it('should not return any pieces when there is a piece bweteen the king and a ranged piece', () => {
			const piecePositions: PieceStartingPositions = {
				wK : [ [1, 5] ],
				wP : [ [2, 5] ],
				bQ : [ [6, 5] ],
				bK : [ [8, 5] ],
			};

			const { allPieces, occupiedSquares } = initializeBoard(piecePositions);

			const checkingPieces = getCheckingPieces(allPieces, occupiedSquares, 'white');
			expect(checkingPieces).toHaveLength(0);
		});
	});

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
				rank : 2,
				file : 4,
			};
			const expectedResult = [
				[ 4, 4 ],
				[ 3, 4 ],
				[ 1, 4 ],
			];
			
			const checkingPath = getCheckingPath(checkingPieceLocation, kingLocation, true);

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
				rank : 3,
				file : 5,
			};
			const kingLocation = {
				rank : 5,
				file : 7,
			};
			const expectedResult = [
				[ 4, 6 ],
				[ 6, 8 ],
			];
			
			const checkingPath = getCheckingPath(checkingPieceLocation, kingLocation, true);

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

	describe('getLegalMoves', () => {
		it('should return an empty array when clickedPiece is null', () => {
			const { allPieces, occupiedSquares } = initializeBoard();
			const checkingPieces: Piece[] = [];
			const clickedPiece = null;
			const colorToMoveNext = 'white';

			expect(getLegalMoves({ allPieces, checkingPieces, clickedPiece, colorToMoveNext, occupiedSquares })).toEqual([]);
		});

		it('should return the clicked piece\'s moves when there are no checking pieces', () => {
			const expectedMoves = [ [5, 3], [5, 4] ];
			const { allPieces, occupiedSquares } = initializeBoard();
			const checkingPieces: Piece[] = [];
			const clickedPiece: Piece = new Pawn({
				color        : 'white',
				abbreviation : 'P',
				rank         : 2,
				file         : 5,
				id           : 4,
			});
			clickedPiece.moves = jest.fn().mockReturnValue(expectedMoves);
			const colorToMoveNext = 'white';

			const legalMoves = getLegalMoves({ allPieces, checkingPieces, clickedPiece, colorToMoveNext, occupiedSquares });
			expect(clickedPiece.moves).toHaveBeenCalledTimes(1);
			expect(clickedPiece.moves).toHaveBeenCalledWith({
				allPieces,
				occupiedSquares,
			});
			expect(legalMoves).toEqual(expectedMoves);
		});

		it('should allow for a checking pieces to be captured if it is the only checking piece', () => {
			const position = {
				wB : [],
				wN : [ [6, 6] ],
				wK : [ [1, 5] ],
				wP : [],
				wQ : [],
				wR : [],
				bB : [],
				bN : [],
				bK : [ [8, 5] ],
				bP : [ [7, 7] ],
				bQ : [],
				bR : [],
			};
			
			const { allPieces, occupiedSquares } = initializeBoard(position);
			const checkingPieces: Piece[] = [ allPieces.wN[0] ];
			const clickedPiece: Piece = allPieces.bP[0];
			const colorToMoveNext = 'black';

			const legalMoves = getLegalMoves({ allPieces, checkingPieces, clickedPiece, colorToMoveNext, occupiedSquares });
			expect(legalMoves).toEqual([ [6, 6] ]);
		});

		it('should allow for a checking pieces to be captured by the king in check if it is the only checking piece', () => {
			const position = {
				wB : [ [7, 4] ],
				wN : [],
				wK : [ [1, 5] ],
				wP : [],
				wQ : [],
				wR : [],
				bB : [],
				bN : [],
				bK : [ [8, 5] ],
				bP : [ [7, 7] ],
				bQ : [],
				bR : [],
			};
			
			const { allPieces, occupiedSquares } = initializeBoard(position);
			const checkingPieces: Piece[] = [ allPieces.wB[0] ];
			const clickedPiece: Piece = allPieces.bK[0];
			const colorToMoveNext = 'black';

			const legalMoves = getLegalMoves({ allPieces, checkingPieces, clickedPiece, colorToMoveNext, occupiedSquares });
			expect(hasMoves(legalMoves, [7, 4])).toBe(true);
		});

		it('should allow for a piece to block if there is the only checking piece', () => {
			const position = {
				wB : [],
				wN : [],
				wK : [ [1, 5] ],
				wP : [],
				wQ : [],
				wR : [ [2, 3] ],
				bB : [],
				bN : [],
				bK : [ [8, 5] ],
				bP : [],
				bQ : [ [4, 2 ] ],
				bR : [],
			};
			
			const { allPieces, occupiedSquares } = initializeBoard(position);
			const checkingPieces: Piece[] = [ allPieces.bQ[0] ];
			const clickedPiece: Piece = allPieces.wR[0];
			const colorToMoveNext = 'white';

			const legalMoves = getLegalMoves({ allPieces, checkingPieces, clickedPiece, colorToMoveNext, occupiedSquares });
			expect(hasMoves(legalMoves, [3, 3])).toBe(true);
			expect(hasMoves(legalMoves, [2, 4])).toBe(true);
		});

		it('should not allow for non-king pieces to move where there are two checking pieces', () => {
			const position = {
				wB : [],
				wN : [],
				wK : [ [1, 5] ],
				wP : [],
				wQ : [],
				wR : [ [2, 3] ],
				bB : [ [3, 7] ],
				bN : [],
				bK : [ [8, 5] ],
				bP : [],
				bQ : [],
				bR : [ [7, 5] ],
			};
			
			const { allPieces, occupiedSquares } = initializeBoard(position);
			const checkingPieces: Piece[] = [ allPieces.bB[0], allPieces.bR[0] ];
			const clickedPiece: Piece = allPieces.wR[0];
			const colorToMoveNext = 'white';

			const legalMoves = getLegalMoves({ allPieces, checkingPieces, clickedPiece, colorToMoveNext, occupiedSquares });
			expect(legalMoves).toEqual([]);
		});

		it('should correctly return king moves when in double check', () => {
			const position = {
				wB : [],
				wN : [],
				wK : [ [1, 5] ],
				wP : [],
				wQ : [],
				wR : [ [2, 3] ],
				bB : [],
				bN : [ [3, 4] ],
				bK : [ [8, 5] ],
				bP : [],
				bQ : [],
				bR : [ [7, 5] ],
			};
			
			const { allPieces, occupiedSquares } = initializeBoard(position);
			const checkingPieces: Piece[] = [ allPieces.bN[0], allPieces.bR[0] ];
			const clickedPiece: Piece = allPieces.wK[0];
			const colorToMoveNext = 'white';

			const legalMoves = getLegalMoves({ allPieces, checkingPieces, clickedPiece, colorToMoveNext, occupiedSquares });
			expect(legalMoves).toEqual([ [1, 6], [1, 4], [2, 4] ]);
		});
	});

	describe('isCheckmate', () => {
		it('should return false when there are no checking pieces', () => {
			const { allPieces, occupiedSquares } = initializeBoard();
			expect(isCheckmate({ allPieces, colorToMoveNext : 'white', occupiedSquares })).toBe(false);
		});

		it('should return false when it is check and there are legal moves', () => {
			const position = {
				wB : [],
				wN : [],
				wK : [ [1, 5] ],
				wP : [],
				wQ : [],
				wR : [ [2, 3] ],
				bB : [],
				bN : [ [3, 4] ],
				bK : [ [8, 5] ],
				bP : [],
				bQ : [],
				bR : [ [7, 5] ],
			};

			const { allPieces, occupiedSquares } = initializeBoard(position);
			expect(isCheckmate({ allPieces, colorToMoveNext : 'white', occupiedSquares })).toBe(false);
		});

		it('should return true when there are no legal moves', () => {
			const position = {
				wB : [],
				wN : [ [7, 6]],
				wK : [ [1, 5] ],
				wP : [],
				wQ : [],
				wR : [ [2, 3] ],
				bB : [],
				bN : [],
				bK : [ [8, 8] ],
				bP : [ [7, 7], [7, 8] ],
				bQ : [],
				bR : [ [8, 7] ],
			};

			const { allPieces, occupiedSquares } = initializeBoard(position);
			expect(isCheckmate({ allPieces, colorToMoveNext : 'black', occupiedSquares })).toBe(true);
		});
	});
});
