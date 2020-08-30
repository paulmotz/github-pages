import { Piece } from './piece';
import { PieceColor, PieceProps } from '@/lib/types';
import { isSquareOnBoard } from '../helpers';

export class Pawn extends Piece {
	_iconName: string;
	_canBeCapturedByEnPassant: boolean;

	constructor({ color, abbreviation, file, rank, id }: PieceProps) {
		super({ color, abbreviation, file, rank, id });
		this._iconName = 'chess-pawn';
		this._canBeCapturedByEnPassant = false;
	}

	/**
	 * Get whether the pawn can be captured vy en passant
	 */
	get canBeCapturedByEnPassant(): boolean {
		return this._canBeCapturedByEnPassant;
	}

	/**
	 * Keep track of whether the pawn can be captured vy en passant
	 */
	set canBeCapturedByEnPassant(canBeCapturedByEnPassant) {
		this._canBeCapturedByEnPassant = canBeCapturedByEnPassant;
	}

	/**
	 * Get the list of Pawn moves
	 * @param occupiedSquares - the currently occupied squares
	 * @return moves - the squares to which the Pawn can move as an array of co-ordinates (also an array)
	 */
	moves(occupiedSquares: Piece[][]): number[][] {
		const color: PieceColor = this.color;
		const file: number = this._file;
		const rank: number = this._rank;
		const moves: number[][] = [];
		let rookPin = false; // a vertical pin
		let bishopPinBD = false; // a diagonal pin that is parallel with the large black diagonal (A1-H8)
		let bishopPinWD = false; // a diagonal pin that is parallel with the large white diagonal (A8-H1)

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
			if (!occupiedSquares[rank][file - 1] && !bishopPinBD && !bishopPinWD) {
				moves.push([rank + 1, file]);

				// a white pawn has not moved if it is on the 2nd rank
				// this has to be nested since if the square one rank above is blocked, the pawn cannot move two squares
				if (rank === 2) {
					if (!occupiedSquares[rank + 1][file - 1]) {
						moves.push([rank + 2, file]);
					}
				}
			}	

			// normal capturing
			if (file - 1 >= 1 && occupiedSquares[rank][file - 2] && occupiedSquares[rank][file - 2].color !== color && !rookPin && !bishopPinBD) {
				moves.push([rank + 1, file - 1]);
			}
			if (file + 1 <= 8 && occupiedSquares[rank][file] && occupiedSquares[rank][file].color !== color && !rookPin && !bishopPinWD) {
				moves.push([rank + 1, file + 1]);
			}

			// en passant
			if (rank === 5) {
				if (file - 1 >= 1) {
					const adjacentSquare = occupiedSquares[rank - 1][file - 2];
					if (adjacentSquare instanceof Pawn && adjacentSquare.canBeCapturedByEnPassant && !rookPin && !bishopPinBD) {
						moves.push([rank + 1, file - 1]);
					}
				}
				if (file + 1 <= 8) {
					const adjacentSquare = occupiedSquares[rank - 1][file];
					if (adjacentSquare instanceof Pawn && adjacentSquare.canBeCapturedByEnPassant && !rookPin && !bishopPinWD) {
						moves.push([rank + 1, file + 1]);
					}
				}
			}
		}

		// black pawns move down the ranks
		else {
			if (!occupiedSquares[rank - 2][file - 1] && !bishopPinBD && !bishopPinWD) {
				moves.push([rank - 1, file]);

				// a black pawn has not moved if it is on the 7th rank
				// this has to be nested since if the square one rank below is blocked, the pawn cannot move two squares
				if (rank === 7) {
					if (!occupiedSquares[rank - 3][file - 1]) {
						moves.push([rank - 2, file]);
					}
				}
			}	

			// normal capturing
			if (file - 1 >= 1 && occupiedSquares[rank - 2][file - 2] && occupiedSquares[rank - 2][file - 2].color !== color && !rookPin && !bishopPinWD) {
				moves.push([rank - 1, file - 1]);
			}
			if (file + 1 <= 8 && occupiedSquares[rank - 2][file] && occupiedSquares[rank - 2][file].color !== color && !rookPin && !bishopPinBD) {
				moves.push([rank - 1, file + 1]);
			}

			// en passant
			if (rank === 4) {
				if (file - 1 >= 1) {
					const adjacentSquare = occupiedSquares[rank - 1][file - 2];
					if (adjacentSquare instanceof Pawn && adjacentSquare.canBeCapturedByEnPassant && !rookPin && !bishopPinWD) {
						moves.push([rank - 1, file - 1]);
					}
				}
				if (file + 1 <= 8) {
					const adjacentSquare = occupiedSquares[rank - 1][file];
					if (adjacentSquare instanceof Pawn && adjacentSquare.canBeCapturedByEnPassant && !rookPin && !bishopPinBD) {
						moves.push([rank - 1, file + 1]);
					}
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
		const color = this.color;
		const rank = this.rank;
		const file = this.file;
		let protectedSquares = color === 'white' 
			? [ [ rank + 1, file - 1 ], [ rank + 1, file + 1 ] ] 
			: [ [ rank - 1, file - 1 ], [ rank - 1, file + 1 ] ];

		protectedSquares = protectedSquares.filter(isSquareOnBoard);

		return protectedSquares;
	}
}
