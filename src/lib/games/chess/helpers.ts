import { pieceColors, AllPieces, PieceMapping, PieceStartingPositions } from '@/lib/types';
import { Bishop, Rook, Queen, King } from '@/lib/games/chess/pieces';
// import { Pawn, Knight, Bishop, Rook, Queen, King } from '@/lib/games/chess/pieces';

/**
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
export const getOtherColor = (color: pieceColors): pieceColors => {
	return color === 'white' ? 'black' : 'white';
};

export const abbreviationToColor: { [name: string]: pieceColors } = {
	b : 'black',
	w : 'white',
};

/**
 * Returns the color of the piece from an abbreviation
 * @param abbreviation - the player's color
 * @return - the opposite color
 */
export const getPieceColor = (abbreviation: string): pieceColors => {
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

export const pieceConstructors = { Bishop, Rook, Queen };
// export const pieceConstructors = { Pawn, Knight, Bishop, Rook, Queen, King };

/**
 * Returns the piece's location in its corresponding array. Due to captures, the piece's id may !== its index
 * @param allPieces - the piece type to find an index for (eg. wP for white pawn)
 * @param piece - the piece type to find an index for (eg. wP for white pawn)
 * @param id - the piece's id
 * @return index 
 */
export function findPieceIndex(allPieces: AllPieces, piece: string, id: number): number {
	return allPieces[piece].findIndex(piece => Number(piece.id) === Number(id));
}

export const pieceStartingPositions: PieceStartingPositions = {
	'wB' : [ [3, 1], [6, 1] ],
	'wN' : [ [2, 1], [7, 1] ],
	'wK' : [ [5, 1] ],
	'wP' : [ [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2] ],
	'wQ' : [ [4, 1] ],
	'wR' : [ [1, 1], [8, 1] ],
	'bB' : [ [3, 8], [6, 8] ],
	'bN' : [ [2, 8], [7, 8] ],
	'bK' : [ [5, 8]] ,
	'bP' : [ [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7]] ,
	'bQ' : [ [4, 8] ],
	'bR' : [ [1, 8], [8, 8] ],
};
