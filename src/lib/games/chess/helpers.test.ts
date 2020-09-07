import { AllPieces } from '@/lib/types';
import { initializeBoard, isSquareOnBoard, removeDuplicates, getOtherColor, getPieceColor, findPieceIndex, getAttackedSquares, findPawnToPromoteLocation, getHighestExistingId, getPromotionPiece } from './helpers';
import { Pawn, Knight, Bishop, Rook, Queen, King } from './pieces';

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

	describe('findPieceIndex', () => {
		it('should return the id of a piece when it is the only piece of its kind', () => {
			const { allPieces } = initializeBoard();

			const pieceIndex = findPieceIndex(allPieces, 'wK', 0);

			expect(pieceIndex).toBe(0);
		});

		it('should return the id of a piece when there are multiple pieces of its kind', () => {
			const { allPieces } = initializeBoard();

			const pieceIndex = findPieceIndex(allPieces, 'wP', 3);

			expect(pieceIndex).toBe(3);
		});

		it('should return -1 when there are no pieces of its kind', () => {
			const { allPieces } = initializeBoard();
			allPieces.bP = [];

			const pieceIndex = findPieceIndex(allPieces, 'bP', 3);

			expect(pieceIndex).toBe(-1);
		});

		it('should return -1 when the specified piece does not exist', () => {
			const { allPieces } = initializeBoard();

			const pieceIndex = findPieceIndex(allPieces, 'xX', 3);

			expect(pieceIndex).toBe(-1);
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

	describe('getAttackedSquares', () => {
		it('should return all squares that a given color is attacking', () => {
			const position = {
				wB : [ [1, 3] ],
				wN : [ [1, 2] ],
				wK : [ [1, 5] ],
				wP : [ [2, 1], [2, 2] ],
				wQ : [ [1, 4] ],
				wR : [ [1, 8] ],
				bB : [ [8, 3], [8, 6] ],
				bN : [],
				bK : [ [8, 5] ] ,
				bP : [ [7, 1], [7, 2], [7, 7], [7, 8] ],
				bQ : [ [8, 4] ],
				bR : [ [8, 1], [8, 8] ],
			};
			const { allPieces, occupiedSquares } = initializeBoard(position);
			const expectedAttackedSquares = [
				[ 7, 2 ], [ 7, 4 ], [ 6, 5 ], [ 5, 6 ],
				[ 4, 7 ], [ 3, 8 ], [ 7, 5 ], [ 6, 4 ],
				[ 5, 3 ], [ 4, 2 ], [ 3, 1 ], [ 7, 7 ],
				[ 7, 6 ], [ 8, 6 ], [ 8, 4 ], [ 6, 2 ],
				[ 6, 1 ], [ 6, 3 ], [ 6, 6 ], [ 6, 8 ],
				[ 6, 7 ], [ 5, 4 ], [ 4, 4 ], [ 3, 4 ],
				[ 2, 4 ], [ 1, 4 ], [ 8, 3 ], [ 8, 5 ],
				[ 7, 3 ], [ 5, 1 ], [ 5, 7 ], [ 4, 8 ],
				[ 7, 1 ], [ 8, 2 ], [ 7, 8 ], [ 8, 7 ],
			];

			const attackedSquares = getAttackedSquares(allPieces, occupiedSquares, 'black');

			expect(attackedSquares).toEqual(expectedAttackedSquares);
		});
	});

	describe('initializeBoard', () => {
		it('should return the values for the starting position when no argument is specified', () => {
			const whitePawns = [0, 1, 2, 3, 4, 5, 6, 7].map(pawnIndex => (
				new Pawn({
					color        : 'white',
					abbreviation : 'P',
					rank         : 2,
					file         : pawnIndex + 1,
					id           : pawnIndex,
				})
			));
			const whiteKnights = [0, 1].map(knightIndex => (
				new Knight({
					color        : 'white',
					abbreviation : 'N',
					rank         : 1,
					file         : knightIndex === 0 ? 2 : 7,
					id           : knightIndex,
				})
			));
			const whiteBishops = [0, 1].map(bishopIndex => (
				new Bishop({
					color        : 'white',
					abbreviation : 'B',
					rank         : 1,
					file         : bishopIndex === 0 ? 3 : 6,
					id           : bishopIndex,
				})
			));
			const whiteRooks = [0, 1].map(rookIndex => (
				new Rook({
					color        : 'white',
					abbreviation : 'R',
					rank         : 1,
					file         : rookIndex === 0 ? 1 : 8,
					id           : rookIndex,
				})
			));
			const whiteQueen = new Queen({
				color        : 'white',
				abbreviation : 'Q',
				rank         : 1,
				file         : 4,
				id           : 0,
			});
			const whiteKing = new King({
				color        : 'white',
				abbreviation : 'K',
				rank         : 1,
				file         : 5,
				id           : 0,
			});
			const blackPawns = [0, 1, 2, 3, 4, 5, 6, 7].map(pawnIndex => (
				new Pawn({
					color        : 'black',
					abbreviation : 'P',
					rank         : 7,
					file         : pawnIndex + 1,
					id           : pawnIndex,
				})
			));
			const blackKnights = [0, 1].map(knightIndex => (
				new Knight({
					color        : 'black',
					abbreviation : 'N',
					rank         : 8,
					file         : knightIndex === 0 ? 2 : 7,
					id           : knightIndex,
				})
			));
			const blackBishops = [0, 1].map(bishopIndex => (
				new Bishop({
					color        : 'black',
					abbreviation : 'B',
					rank         : 8,
					file         : bishopIndex === 0 ? 3 : 6,
					id           : bishopIndex,
				})
			));
			const blackRooks = [0, 1].map(rookIndex => (
				new Rook({
					color        : 'black',
					abbreviation : 'R',
					rank         : 8,
					file         : rookIndex === 0 ? 1 : 8,
					id           : rookIndex,
				})
			));
			const blackQueen = new Queen({
				color        : 'black',
				abbreviation : 'Q',
				rank         : 8,
				file         : 4,
				id           : 0,
			});
			const blackKing = new King({
				color        : 'black',
				abbreviation : 'K',
				rank         : 8,
				file         : 5,
				id           : 0,
			});
			const expectedAllPieces: AllPieces = {
				wB : [ ...whiteBishops ],
				wN : [ ...whiteKnights ],
				wK : [ whiteKing ],
				wP : [ ...whitePawns ],
				wQ : [ whiteQueen ],
				wR : [ ...whiteRooks ],
				bB : [ ...blackBishops ],
				bN : [ ...blackKnights ],
				bK : [ blackKing ] ,
				bP : [ ...blackPawns ],
				bQ : [ blackQueen ],
				bR : [ ...blackRooks ],
			};
			const expectedOccupiedSquares = [];
			for (let i = 0; i < 8; i++) {
				expectedOccupiedSquares.push(new Array(8).fill(null));
			}
			for (const pieceType in expectedAllPieces) {
				for (const piece of expectedAllPieces[pieceType]) {
					expectedOccupiedSquares[piece.rank - 1][piece.file - 1] = piece;
				}
			}

			const { allPieces, occupiedSquares } = initializeBoard();

			expect(allPieces).toEqual(expectedAllPieces);
			expect(occupiedSquares).toEqual(expectedOccupiedSquares);
		});

		it('should return allPieces and occupiedSquares for an arbitrary position when one is passed in', () => {
			const position = {
				wK : [ [1, 5] ],
				wQ : [ [1, 4] ],
				bK : [ [8, 5] ],
			};
			const whiteQueen = new Queen({
				color        : 'white',
				abbreviation : 'Q',
				rank         : 1,
				file         : 4,
				id           : 0,
			});
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
			const expectedAllPieces: AllPieces = {
				wB : [],
				wN : [],
				wK : [ whiteKing ],
				wP : [],
				wQ : [ whiteQueen ],
				wR : [],
				bB : [],
				bN : [],
				bK : [ blackKing ] ,
				bP : [],
				bQ : [],
				bR : [],
			};
			const expectedOccupiedSquares = [];
			for (let i = 0; i < 8; i++) {
				expectedOccupiedSquares.push(new Array(8).fill(null));
			}
			for (const pieceType in expectedAllPieces) {
				for (const piece of expectedAllPieces[pieceType]) {
					expectedOccupiedSquares[piece.rank - 1][piece.file - 1] = piece;
				}
			}

			const { allPieces, occupiedSquares } = initializeBoard(position);

			expect(allPieces).toEqual(expectedAllPieces);
			expect(occupiedSquares).toEqual(expectedOccupiedSquares);
		});
	});

	describe('findPawnToPromoteLocation', () => {
		it('should return the location of a white pawn to be promoted', () => {
			const expectedPawnLocation = {
				rank : 8,
				file : 2,
			};
			const position = {
				wK : [ [1, 5] ],
				wP : [ [2, 1], [expectedPawnLocation.rank, expectedPawnLocation.file], [5, 6] ],
				bK : [ [8, 5] ],
			};
			const { allPieces } = initializeBoard(position);

			const promotionLocaiton = findPawnToPromoteLocation(allPieces, 'white');

			expect(promotionLocaiton).toEqual(expectedPawnLocation);
		});

		it('should return the location of a black pawn to be promoted', () => {
			const expectedPawnLocation = {
				rank : 1,
				file : 2,
			};
			const position = {
				wK : [ [1, 5] ],
				wP : [ [3, 3] ],
				bK : [ [8, 5] ],
				bP : [ [6, 3], [4, 4], [expectedPawnLocation.rank, expectedPawnLocation.file] ],
			};
			const { allPieces } = initializeBoard(position);

			const promotionLocaiton = findPawnToPromoteLocation(allPieces, 'black');

			expect(promotionLocaiton).toEqual(expectedPawnLocation);
		});

		it('should throw an error when a white pawn cannot be found to promote', () => {
			const position = {
				wK : [ [1, 5] ],
				wP : [ [3, 3] ],
				bK : [ [8, 5] ],
				bP : [ [6, 3], [4, 4] ],
			};
			const { allPieces } = initializeBoard(position);

			expect(() => findPawnToPromoteLocation(allPieces, 'white')).toThrow('Could not promote pawn!');
		});

		it('should throw an error when a black pawn cannot be found to promote', () => {
			const position = {
				wK : [ [1, 5] ],
				wP : [ [3, 3] ],
				bK : [ [8, 5] ],
			};
			const { allPieces } = initializeBoard(position);

			expect(() => findPawnToPromoteLocation(allPieces, 'black')).toThrow('Could not promote pawn!');
		});
	});

	describe('getHighestExistingId', () => {
		it('should return the highest existing id of a given piece type', () => {
			const { allPieces } = initializeBoard();

			const highestExistingId = getHighestExistingId(allPieces, 'P', 'white');

			expect(highestExistingId).toBe(7);
		});

		it('should return -1 if there are no pieces of that type', () => {
			const { allPieces } = initializeBoard();
			allPieces.wB = [];

			const highestExistingId = getHighestExistingId(allPieces, 'B', 'white');

			expect(highestExistingId).toBe(-1);
		});
	});

	describe('getPromotionPiece', () => {
		it('should promote a pawn to a specified piece', () => {
			const promotionLocation = {
				rank : 8,
				file : 2,
			};
			const position = {
				wK : [ [1, 5] ],
				wP : [ [2, 1], [promotionLocation.rank, promotionLocation.file], [5, 6] ],
				bK : [ [8, 5] ],
			};
			const { allPieces } = initializeBoard(position);

			const piece = getPromotionPiece(allPieces, { color : 'white', abbreviation : 'N', rank : promotionLocation.rank, file : promotionLocation.file });

			expect(piece).toBeInstanceOf(Knight);
			expect(piece.rank).toBe(promotionLocation.rank);
			expect(piece.file).toBe(promotionLocation.file);
		});
	});
});
