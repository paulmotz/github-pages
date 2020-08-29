import { Piece } from './piece';
import { pieceColors, PieceProps } from '@/lib/types';
import { isSquareOnBoard } from '../helpers';

export class Pawn extends Piece {
	_iconName: string;

	constructor({ color, abbreviation, file, rank, id }: PieceProps) {
		super({ color, abbreviation, file, rank, id });
		this._iconName = 'chess-pawn';
	}

	/**
	 * Get the list of Pawn moves
	 * @param occupiedSquares - the currently occupied squares
	 * @return moves - the squares to which the Pawn can move as an array of co-ordinates (also an array)
	 */
	moves(occupiedSquares: string[][]): number[][] {
		const color: pieceColors = this.color;
		const file: number = this._file;
		const rank: number = this._rank;
		const moves: number[][] = [];
		let rookPin = false; // a vertical pin
		let bishopPinBD = false; // a diagonal pin that is parallel with the large black diagonal (A1-H8)
		let bishopPinWD = false; // a diagonal pin that is parallel with the large white diagonal (A8-H1)

		const isEnPassantPawn = 'false'; // TODO: implement en passant

		// pawn pin checks work, but I don't think it is very elegant
		const pD = this.getPinDirection(occupiedSquares);
		if (pD) {
			const [f, r] = pD;

			// horizontal/vertical pin
			if ((f + r) % 2 !== 0) {
				if (r === 0) {

					// a horizontally pinned pawn cannot move at all
					return moves;
				}
				else {
					rookPin = true;
				}
			}
			else {
				if (f === r) {
					bishopPinBD = true;
				}
				else {
					bishopPinWD = true;
				}
			}
		}

		
		// white pawns move up the ranks
		if (color === 'white') {
			if (!occupiedSquares[file][rank + 1] && !bishopPinBD && !bishopPinWD) {
				moves.push([file, rank + 1]);

				// a white pawn has not moved if it is on the 2nd rank
				// this has to be nested since if the square one rank above is blocked, the pawn cannot move two squares
				if (rank === 2) {
					if (!occupiedSquares[file][rank + 2]) {
						moves.push([file, rank + 2]);
					}
				}
			}	

			// normal capturing
			if (file - 1 >= 1 && occupiedSquares[file - 1][rank + 1]&& occupiedSquares[file - 1][rank + 1][0] !== color && !rookPin && !bishopPinBD) {
				moves.push([file - 1, rank + 1]);
			}
			if (file + 1 <= 8 && occupiedSquares[file + 1][rank + 1] && occupiedSquares[file + 1][rank + 1][0] !== color && !rookPin && !bishopPinWD) {
				moves.push([file + 1, rank + 1]);
			}

			// en passant
			if (rank === 5) {
				// if (file - 1 >= 1 && occupiedSquares[squareToIndex([file - 1, rank]) - 1] && occupiedSquares[squareToIndex([file - 1, rank]) - 1][0] !== color && occupiedSquares[squareToIndex([file - 1, rank]) - 1] === enPassantPawn) {
				if (file - 1 >= 1 && occupiedSquares[file - 1][rank] && occupiedSquares[file - 1][rank] === isEnPassantPawn && !rookPin && !bishopPinBD) {
					moves.push([file - 1, rank + 1]);
				}
				if (file + 1 <= 8 && occupiedSquares[file + 1][rank] && occupiedSquares[file + 1][rank] === isEnPassantPawn && !rookPin && !bishopPinWD) {
					moves.push([file + 1, rank + 1]);
				}
			}
		}

		// black pawns move down the ranks
		else {
			if (!occupiedSquares[file][rank - 1] && !bishopPinBD && !bishopPinWD) {
				moves.push([file, rank - 1]);

				// a black pawn has not moved if it is on the 7th rank
				// this has to be nested since if the square one rank below is blocked, the pawn cannot move two squares
				if (rank === 7) {
					if (!occupiedSquares[file][rank - 2]) {
						moves.push([file, rank - 2]);
					}
				}
			}	

			// normal capturing
			if (file - 1 >= 1 && occupiedSquares[file - 1][rank - 1] && occupiedSquares[file - 1][rank - 1][0] !== color && !rookPin && !bishopPinWD) {
				moves.push([file - 1, rank - 1]);
			}
			if (file + 1 <= 8 && occupiedSquares[file + 1][rank - 1] && occupiedSquares[file + 1][rank - 1][0] !== color && !rookPin && !bishopPinBD) {
				moves.push([file + 1, rank - 1]);
			}

			// en passant
			if (rank === 4) {
				if (file - 1 >= 1 && occupiedSquares[file - 1][rank] && occupiedSquares[file - 1][rank] === isEnPassantPawn && !rookPin && !bishopPinWD) {
					moves.push([file - 1, rank - 1]);
				}
				if (file + 1 <= 8 && occupiedSquares[file + 1][rank] && occupiedSquares[file + 1][rank] === isEnPassantPawn && !rookPin && !bishopPinBD) {
					moves.push([file + 1, rank - 1]);
				}
			}
		}

		return moves;
	}

	/**
	 * Get the squares that the Pawn protects
	 * @return protectedSquares - the squares that the Pawn protects as an array of co-ordinates (also an array)
	 */
	protectedSquares(): number[][] {
		const color = this._color;
		const file = this._file;
		const rank = this._rank;
		let protectedSquares = color === 'white' ? [[file - 1, rank + 1], [file + 1, rank + 1]] : 
			[[file - 1, rank - 1], [file + 1, rank - 1]];

		protectedSquares = protectedSquares.filter(isSquareOnBoard);

		return protectedSquares;
	}
}
