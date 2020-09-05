import { PieceColor, PieceType, AllPieces, PieceMapping, PieceStartingPositions, ColorAndPiece, BoardState, PieceAbbreviation } from '@/lib/types';
import { Piece, Pawn, Knight, Bishop, Rook, Queen, King } from '@/lib/games/chess/pieces';

/**
 *
 * Checks whether the square is on the board
 * @param square - the square's file, two numbers: 1 - 8
 * @return - whether the square is on the board
 */
export const isSquareOnBoard = (square: number[]): boolean =>  {
	return square[0] >= 1 && square[0] <= 8 && square[1] >= 1 && square[1] <= 8;
};

/**
 * Returns the color of the other player
 * @param color - the player's color
 * @return - the opposite color
 */
export const getOtherColor = (color: PieceColor): PieceColor => {
	return color === 'white' ? 'black' : 'white';
};

export const abbreviationToColor: { [name: string]: PieceColor } = {
	b : 'black',
	w : 'white',
};

/**
 * Returns the color of the piece from an abbreviation
 * @param abbreviation - the player's color
 * @return - the opposite color
 */
export const getPieceColor = (abbreviation: string): PieceColor => {
	return abbreviationToColor[abbreviation[0]];
};

/**
 * Returns the color of the piece from an abbreviation
 * @param abbreviation - the player's color
 * @return - the opposite color
 */
export const getPieceName = (abbreviation: string): string => {
	const pieceMapping: PieceMapping  = {
		'P' : 'Pawn',
		'N' : 'Knight',
		'B' : 'Bishop',
		'R' : 'Rook',
		'Q' : 'Queen',
		'K' : 'King',
	}; 

	return pieceMapping[abbreviation];
};

/**
 * Returns the piece's location in its corresponding array. Due to captures, the piece's id may !== its index
 * @param allPieces - the piece type to find an index for (eg. wP for white pawn)
 * @param piece - the piece type to find an index for (eg. wP for white pawn)
 * @param id - the piece's id
 * @return index 
 */
export const findPieceIndex = (allPieces: AllPieces, piece: string, id: number): number => {
	if (!allPieces[piece]) {
		return -1;
	}

	return allPieces[piece].findIndex(piece => Number(piece.id) === Number(id));
};

export const removeDuplicates = (moves: number[][]): number[][] => {
	const uniqueMoves = [];

	const existing = {}  as { [index: string]: boolean};
	for (const move of moves) {
		const stringMove = `${move[0]}${move[1]}`;
		if (!existing[stringMove]) {
			uniqueMoves.push(move);
		}

		existing[stringMove] = true;
	}

	return uniqueMoves;
};

export const getAttackedSquares = (allPieces: AllPieces, occupiedSquares: (Piece | null)[][], opponentColor?: PieceColor): number[][] => {
	const moves = [];
	for (const pieceType in allPieces) {
		if (!opponentColor || pieceType.startsWith(opponentColor[0])) {
			for (const piece of allPieces[pieceType]) {
				moves.push(...piece.protectedSquares(occupiedSquares));
			}
		}
	}

	return removeDuplicates(moves);
};

export const pieceStartingPositions: PieceStartingPositions = {
	'wB' : [ [1, 3], [1, 6] ],
	'wN' : [ [1, 2], [1, 7] ],
	'wK' : [ [1, 5] ],
	'wP' : [ [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8] ],
	'wQ' : [ [1, 4] ],
	'wR' : [ [1, 1], [1, 8] ],
	'bB' : [ [8, 3], [8, 6] ],
	'bN' : [ [8, 2], [8, 7] ],
	'bK' : [ [8, 5]] ,
	'bP' : [ [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7], [7, 8]] ,
	'bQ' : [ [8, 4] ],
	'bR' : [ [8, 1], [8, 8] ],
	// 'wK' : [ [1, 5] ],
	// 'wQ' : [ [1, 4] ],
	// 'bK' : [ [8, 5]] ,
};

export const pieceTypes: ColorAndPiece[] = [
	'wB', 'wN', 'wK', 'wP', 'wQ', 'wR', 'bB', 'bN', 'bK', 'bP', 'bQ', 'bR',
];

export const initializeBoard = (position = pieceStartingPositions): BoardState => {
	const pieceConstructors = {
		'P' : Pawn,
		'N' : Knight,
		'B' : Bishop,
		'R' : Rook,
		'Q' : Queen,
		'K' : King,
	};

	const allPieces: AllPieces = {};
	const occupiedSquares: (Piece | null)[][] = [];
	const boardSize = 8;


	for (let i = 0; i < boardSize; i++) {
		occupiedSquares.push(new Array(boardSize).fill(null));
	}
	for (const pieceType of pieceTypes) {
		allPieces[pieceType] = [];
	}
	
	for (const piece in position) {
		const color: PieceColor = getPieceColor(piece);
		const abbreviation = piece[1] as PieceAbbreviation;

		for (const pieceStartingPositionIndex in position[piece]) {
			const [ rank, file ]: number[] = position[piece][pieceStartingPositionIndex];

			const newPiece: PieceType = new pieceConstructors[abbreviation]({ color, abbreviation, rank, file, id : Number(pieceStartingPositionIndex)});

			allPieces[piece].push(newPiece);
			occupiedSquares[rank - 1][file - 1] = newPiece;
		}
	}

	return {
		allPieces,
		occupiedSquares,
	};
}; 