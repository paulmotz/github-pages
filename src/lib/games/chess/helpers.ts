import { pieceColors, IAllPieces, IPieceStartingMapping } from '@/lib/types';
import { Piece, Pawn, Knight, Bishop, Rook, Queen, King } from '@/lib/games/chess/pieces';

/**
 * Checks whether the square is on the board
 * @param square - the square's file, two numbers: 1 - 8
 * @return {Boolen} - whether the square is on the board
 */
export const checkSquareOnBoard = (square: Number[]) =>  {
	return square[0] >= 1 && square[0] <= 8 && square[1] >= 1 && square[1] <= 8;
};

/**
 * Returns the color of the other player
 * @param color - the player's color
 * @return {pieceColors} - the opposite color
 */
export const getOtherColor = (color: pieceColors) => {
	return color === 'white' ? 'black' : 'white';
};

export const abbreviationToColor : { [name: string] : pieceColors } = {
	b : 'black',
	w : 'white',
};

/**
 * Returns the color of the piece from an abbreviation
 * @param abbreviation - the player's color
 * @return {pieceColors} - the opposite color
 */
export const getPieceColor = (abbreviation: string) => {
	return abbreviationToColor[abbreviation[0]];
};

/**
 * Returns the color of the piece from an abbreviation
 * @param abbreviation - the player's color
 * @return {String} - the opposite color
 */
export const getPieceName = (abbreviation: string) => {
	const pieceMapping : IPieceStartingMapping  = {
		'P' : 'Pawn',
		'N' : 'Knight',
		'B' : 'Bishop',
		'R' : 'Rook',
		'Q' : 'Queen',
		'K' : 'King',
	}; 

	return pieceMapping[abbreviation];
};

export const pieceConstructors = { Pawn, Knight, Bishop, Rook, Queen, King };

/**
 * Returns the piece's location in its corresponding array. Due to captures, the piece's id may !== its index
 * @param allPieces - the piece type to find an index for (eg. wP for white pawn)
 * @param piece - the piece type to find an index for (eg. wP for white pawn)
 * @param id - the piece's id
 * @return {Number} index 
 */
export function findPieceIndex(allPieces: IAllPieces, piece: string, id: number) {
	return allPieces[piece].findIndex(piece => Number(piece.id) === Number(id));
}
