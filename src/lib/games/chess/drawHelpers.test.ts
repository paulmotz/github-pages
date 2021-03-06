import { isStalemate, hasMajorPieces, hasPawns, hasDifferentColorSquarePieces, hasSufficientBishops, hasKnightAndBishop, hasInsufficientMatingMaterial, getBoardState } from './drawHelpers';
import { initializeBoard } from './helpers';
import { Piece, Pawn, Knight, Bishop, Rook, Queen, King } from './pieces';
import { PiecesByType } from '@/lib/types';

const getOccupiedSquares = (allPieces: PiecesByType): (Piece | null)[][] => {
	const occupiedSquares = [];
	for (let i = 0; i < 8; i++) {
		occupiedSquares.push(new Array(8).fill(null));
	}
	for (const pieceType in allPieces) {
		for (const piece of allPieces[pieceType]) {
			occupiedSquares[piece.rank - 1][piece.file - 1] = piece;
		}
	}
	
	return occupiedSquares;
};

describe('drawHelpers', () => {
	describe('isStalemate', () => {
		it('should return true for a position that is a stalemate', () => {
			const whiteQueen = new Queen({
				color        : 'white',
				abbreviation : 'Q',
				rank         : 7,
				file         : 6,
				id           : 0,
			});
			const whiteKing = new King({
				color        : 'white',
				abbreviation : 'K',
				rank         : 1,
				file         : 1,
				id           : 0,
			});
			const blackKing = new King({
				color        : 'black',
				abbreviation : 'K',
				rank         : 8,
				file         : 8,
				id           : 0,
			});

			// HACK: have to specify rooks here since they are used in king moves
			const allPieces = {
				bK : [ blackKing ],
				bR : [],
				wQ : [ whiteQueen ],
				wK : [ whiteKing ],
				wR : [],
			};
			const occupiedSquares = getOccupiedSquares(allPieces);
			
			expect(isStalemate(allPieces, occupiedSquares, 'black')).toBe(true);
		});

		it('should return false for a position that is not a stalemate', () => {
			const whiteQueen = new Queen({
				color        : 'white',
				abbreviation : 'Q',
				rank         : 7,
				file         : 5,
				id           : 0,
			});
			const whiteKing = new King({
				color        : 'white',
				abbreviation : 'K',
				rank         : 1,
				file         : 1,
				id           : 0,
			});
			const blackKing = new King({
				color        : 'black',
				abbreviation : 'K',
				rank         : 8,
				file         : 8,
				id           : 0,
			});

			// HACK: have to specify rooks here since they are used in king moves
			const allPieces = {
				bK : [ blackKing ],
				bR : [],
				wQ : [ whiteQueen ],
				wK : [ whiteKing ],
				wR : [],
			};
			const occupiedSquares = getOccupiedSquares(allPieces);
			
			expect(isStalemate(allPieces, occupiedSquares, 'black')).toBe(false);
		});

		it('should return false for checkmate', () => {
			const whiteQueen = new Queen({
				color        : 'white',
				abbreviation : 'Q',
				rank         : 8,
				file         : 6,
				id           : 0,
			});
			const whiteKing = new King({
				color        : 'white',
				abbreviation : 'K',
				rank         : 6,
				file         : 8,
				id           : 0,
			});
			const blackKing = new King({
				color        : 'black',
				abbreviation : 'K',
				rank         : 8,
				file         : 8,
				id           : 0,
			});

			// HACK: have to specify rooks here since they are used in king moves
			const allPieces = {
				bK : [ blackKing ],
				bR : [],
				wQ : [ whiteQueen ],
				wK : [ whiteKing ],
				wR : [],
			};
			const occupiedSquares = getOccupiedSquares(allPieces);
			
			expect(isStalemate(allPieces, occupiedSquares, 'black')).toBe(false);
		});
	});

	describe('hasMajorPieces', () => {
		it('shoud return true for a full board', () => {
			const { allPieces } = initializeBoard();

			expect(hasMajorPieces(allPieces)).toBe(true);
		});

		it('shoud return true when there is only one major piece', () => {
			const whiteKing = new King({
				color        : 'white',
				abbreviation : 'K',
				rank         : 6,
				file         : 8,
				id           : 0,
			});
			const whiteRook = new Rook({
				color        : 'white',
				abbreviation : 'R',
				rank         : 1,
				file         : 1,
				id           : 0,
			});
			const blackKing = new King({
				color        : 'black',
				abbreviation : 'K',
				rank         : 8,
				file         : 8,
				id           : 0,
			});

			const allPieces = {
				bK : [ blackKing ],
				wK : [ whiteKing ],
				wR : [ whiteRook ],
			};

			expect(hasMajorPieces(allPieces)).toBe(true);
		});

		it('shoud return false when there are no queens and no rooks', () => {
			const { allPieces } = initializeBoard();
			allPieces.bQ = [];
			allPieces.bR = [];
			allPieces.wQ = [];
			allPieces.wR = [];

			expect(hasMajorPieces(allPieces)).toBe(false);
		});

		it('shoud return false when there the arrays for queens and rooks are not defined', () => {
			const whiteKing = new King({
				color        : 'white',
				abbreviation : 'K',
				rank         : 6,
				file         : 8,
				id           : 0,
			});
			const blackKing = new King({
				color        : 'black',
				abbreviation : 'K',
				rank         : 8,
				file         : 8,
				id           : 0,
			});

			const allPieces = {
				bK : [ blackKing ],
				wK : [ whiteKing ],
			};

			expect(hasMajorPieces(allPieces)).toBe(false);
		});
	});

	describe('haPawns', () => {
		it('shoud return true for a full board', () => {
			const { allPieces } = initializeBoard();

			expect(hasPawns(allPieces)).toBe(true);
		});

		it('shoud return true when there is only one pawn', () => {
			const whiteKing = new King({
				color        : 'white',
				abbreviation : 'K',
				rank         : 6,
				file         : 8,
				id           : 0,
			});
			const whitePawn = new Pawn({
				color        : 'white',
				abbreviation : 'B',
				rank         : 2,
				file         : 1,
				id           : 0,
			});
			const blackKing = new King({
				color        : 'black',
				abbreviation : 'K',
				rank         : 8,
				file         : 8,
				id           : 0,
			});

			const allPieces = {
				bK : [ blackKing ],
				wK : [ whiteKing ],
				wP : [ whitePawn ],
			};

			expect(hasPawns(allPieces)).toBe(true);
		});

		it('shoud return false when there are no queens and no rooks', () => {
			const { allPieces } = initializeBoard();
			allPieces.bP = [];
			allPieces.wP = [];

			expect(hasPawns(allPieces)).toBe(false);
		});

		it('shoud return false when the arrays for pawns are not defined', () => {
			const whiteKing = new King({
				color        : 'white',
				abbreviation : 'K',
				rank         : 6,
				file         : 8,
				id           : 0,
			});
			const blackKing = new King({
				color        : 'black',
				abbreviation : 'K',
				rank         : 8,
				file         : 8,
				id           : 0,
			});

			const allPieces = {
				bK : [ blackKing ],
				wK : [ whiteKing ],
			};

			expect(hasPawns(allPieces)).toBe(false);
		});
	});

	describe('hasDifferentColorSquarePieces', () => {
		it('shoud return true when the pieces are on different square colors', () => {
			const bishops = [
				new Bishop({
					color        : 'white',
					abbreviation : 'B',
					rank         : 1,
					file         : 3,
					id           : 0,
				}),
				new Bishop({
					color        : 'white',
					abbreviation : 'B',
					rank         : 1,
					file         : 6,
					id           : 0,
				}),
			];
	
			expect(hasDifferentColorSquarePieces(bishops)).toBe(true);
		});

		it('shoud return false when there is only one piece', () => {
			const bishops = [
				new Bishop({
					color        : 'white',
					abbreviation : 'B',
					rank         : 1,
					file         : 3,
					id           : 0,
				}),
			];
	
			expect(hasDifferentColorSquarePieces(bishops)).toBe(false);
		});

		it('shoud return false when all pieces are on the same square color', () => {
			const bishops = [
				new Bishop({
					color        : 'white',
					abbreviation : 'B',
					rank         : 1,
					file         : 1,
					id           : 0,
				}),
				new Bishop({
					color        : 'white',
					abbreviation : 'B',
					rank         : 1,
					file         : 3,
					id           : 0,
				}),
				new Bishop({
					color        : 'white',
					abbreviation : 'B',
					rank         : 1,
					file         : 5,
					id           : 0,
				}),
				new Bishop({
					color        : 'white',
					abbreviation : 'B',
					rank         : 1,
					file         : 7,
					id           : 0,
				}),
			];
	
			expect(hasDifferentColorSquarePieces(bishops)).toBe(false);
		});
	});

	describe('hasSufficientBishops', () => {
		it('shoud return true for a full board', () => {
			const { allPieces } = initializeBoard();

			expect(hasSufficientBishops(allPieces)).toBe(true);
		});

		it('shoud return true when there are two bishops on different square colors', () => {
			const whiteKing = new King({
				color        : 'white',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});
			const whiteBishops = [
				new Bishop({
					color        : 'white',
					abbreviation : 'B',
					rank         : 1,
					file         : 3,
					id           : 0,
				}),
				new Bishop({
					color        : 'white',
					abbreviation : 'B',
					rank         : 1,
					file         : 6,
					id           : 0,
				}),
			];
			const blackKing = new King({
				color        : 'black',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});

			const allPieces = {
				bK : [ blackKing ],
				wB : [ ...whiteBishops ],
				wK : [ whiteKing ],
			};

			expect(hasSufficientBishops(allPieces)).toBe(true);
		});

		it('shoud return false when there is only one bishop per side', () => {
			const whiteKing = new King({
				color        : 'white',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});
			const whiteBishop = new Bishop({
				color        : 'white',
				abbreviation : 'B',
				rank         : 1,
				file         : 6,
				id           : 0,
			});
			const blackBishop = new Bishop({
				color        : 'white',
				abbreviation : 'B',
				rank         : 8,
				file         : 6,
				id           : 0,
			});
			const blackKing = new King({
				color        : 'black',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});

			const allPieces = {
				bB : [ blackBishop ],
				bK : [ blackKing ],
				wB : [ whiteBishop ],
				wK : [ whiteKing ],
			};

			expect(hasSufficientBishops(allPieces)).toBe(false);
		});

		it('shoud return false when there are two bishops but on the same square color', () => {
			const whiteKing = new King({
				color        : 'white',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});
			const whiteBishops = [
				new Bishop({
					color        : 'white',
					abbreviation : 'B',
					rank         : 1,
					file         : 3,
					id           : 0,
				}),
				new Bishop({
					color        : 'white',
					abbreviation : 'B',
					rank         : 1,
					file         : 1,
					id           : 0,
				}),
			];
			const blackKing = new King({
				color        : 'black',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});

			const allPieces = {
				bK : [ blackKing ],
				wB : [ ...whiteBishops ],
				wK : [ whiteKing ],
			};

			expect(hasSufficientBishops(allPieces)).toBe(false);
		});
	});

	describe('hasKnightAndBishop', () => {
		it('should return true when there is a knight and a bishop', () => {
			const whiteKing = new King({
				color        : 'white',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});
			const whiteBishop = new Bishop({
				color        : 'white',
				abbreviation : 'B',
				rank         : 1,
				file         : 3,
				id           : 0,
			});
			const whiteKnight = new Knight({
				color        : 'white',
				abbreviation : 'N',
				rank         : 1,
				file         : 2,
				id           : 0,
			});
			const blackKing = new King({
				color        : 'black',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});

			const allPieces = {
				bK : [ blackKing ],
				wB : [ whiteBishop ],
				wN : [ whiteKnight ],
				wK : [ whiteKing ],
			};

			expect(hasKnightAndBishop(allPieces)).toBe(true);
		});

		it('should return false when there is a knight but not a bishop', () => {
			const whiteKing = new King({
				color        : 'white',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});
			const whiteKnight = new Knight({
				color        : 'white',
				abbreviation : 'N',
				rank         : 1,
				file         : 2,
				id           : 0,
			});
			const blackKing = new King({
				color        : 'black',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});

			const allPieces = {
				bK : [ blackKing ],
				wN : [ whiteKnight ],
				wK : [ whiteKing ],
			};

			expect(hasKnightAndBishop(allPieces)).toBe(false);
		});

		it('should return false when there is a bishop but not a knight', () => {
			const whiteKing = new King({
				color        : 'white',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});
			const whiteBishop = new Bishop({
				color        : 'white',
				abbreviation : 'B',
				rank         : 1,
				file         : 3,
				id           : 0,
			});
			const blackKing = new King({
				color        : 'black',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});
			const allPieces = {
				bK : [ blackKing ],
				wB : [ whiteBishop ],
				wN : [],
				wK : [ whiteKing ],
			};

			expect(hasKnightAndBishop(allPieces)).toBe(false);
		});
	});

	describe('hasInsufficientMatingMaterial', () => {
		it('should return true when there are no major pieces, pawns and insufficient minor pieces', () => {
			const whiteKing = new King({
				color        : 'white',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});
			const whiteBishop = new Bishop({
				color        : 'white',
				abbreviation : 'B',
				rank         : 1,
				file         : 3,
				id           : 0,
			});
			const blackKing = new King({
				color        : 'black',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});
			const allPieces = {
				bK : [ blackKing ],
				wB : [ whiteBishop ],
				wK : [ whiteKing ],
			};

			expect(hasInsufficientMatingMaterial(allPieces)).toBe(true);
		});

		it('should return false when there are major pieces', () => {
			const whiteKing = new King({
				color        : 'white',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});
			const whiteQuuen = new Queen({
				color        : 'white',
				abbreviation : 'Q',
				rank         : 1,
				file         : 4,
				id           : 0,
			});
			const blackKing = new King({
				color        : 'black',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});
			const allPieces = {
				bK : [ blackKing ],
				wQ : [ whiteQuuen ],
				wK : [ whiteKing ],
			};

			expect(hasInsufficientMatingMaterial(allPieces)).toBe(false);
		});	

		it('should return false when there are pawns', () => {
			const whiteKing = new King({
				color        : 'white',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});
			const whitePawn = new Pawn({
				color        : 'white',
				abbreviation : 'P',
				rank         : 2,
				file         : 4,
				id           : 0,
			});
			const blackKing = new King({
				color        : 'black',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});
			const allPieces = {
				bK : [ blackKing ],
				wP : [ whitePawn ],
				wK : [ whiteKing ],
			};

			expect(hasInsufficientMatingMaterial(allPieces)).toBe(false);
		});

		it('should return false when there are sufficient bishops', () => {
			const whiteKing = new King({
				color        : 'white',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});
			const blackBishops = [
				new Bishop({
					color        : 'black',
					abbreviation : 'B',
					rank         : 8,
					file         : 3,
					id           : 0,
				}),
				new Bishop({
					color        : 'black',
					abbreviation : 'B',
					rank         : 8,
					file         : 6,
					id           : 0,
				}),
			];
			const blackKing = new King({
				color        : 'black',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});
			const allPieces = {
				bK : [ blackKing ],
				bB : [ ...blackBishops ],
				wK : [ whiteKing ],
			};

			expect(hasInsufficientMatingMaterial(allPieces)).toBe(false);
		});

		it('should return false when there is a knight and a bishop of the same color', () => {
			const whiteKing = new King({
				color        : 'white',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});
			const blackBishop = new Bishop({
				color        : 'black',
				abbreviation : 'B',
				rank         : 8,
				file         : 3,
				id           : 0,
			});
			const blackKnight = new Knight({
				color        : 'black',
				abbreviation : 'N',
				rank         : 8,
				file         : 2,
				id           : 0,
			});
			const blackKing = new King({
				color        : 'black',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});
			const allPieces = {
				bK : [ blackKing ],
				bB : [ blackBishop ],
				bN : [ blackKnight ],
				wK : [ whiteKing ],
			};

			expect(hasInsufficientMatingMaterial(allPieces)).toBe(false);
		});
	});

	describe('getBoardState', () => {
		it('shold return a string representing the current board state', () => {
			const { occupiedSquares } = initializeBoard();

			const boardState = getBoardState(occupiedSquares);

			expect(boardState).toBe('wRwNwBwQwKwBwNwRwPwPwPwPwPwPwPwP________________________________________________________________bPbPbPbPbPbPbPbPbRbNbBbQbKbBbNbR');
		});
	});
});
