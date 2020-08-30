import { PieceColor, AllPieces, PieceMapping, PieceStartingPositions, ColorAndPiece} from '@/lib/types';

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
	return allPieces[piece].findIndex(piece => Number(piece.id) === Number(id));
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
};

export const pieceTypes: ColorAndPiece[] = [
	'wB', 'wN', 'wK', 'wP', 'wQ', 'wR', 'bB', 'bN', 'bK', 'bP', 'bQ', 'bR',
];
