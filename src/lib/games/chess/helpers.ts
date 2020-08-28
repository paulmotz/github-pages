import { pieceColors, IAllPieces } from '@/lib/types';

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
 * @param {String} color - the player's color
 * @return {String} - the opposite color
 */
export function otherColor(color: pieceColors) {
	return color === 'white' ? 'black' : 'white';
}

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