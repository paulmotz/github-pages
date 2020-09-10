import { PieceProps, MoveParams } from '@/lib/types';
import { Piece } from './piece';

export abstract class RangedPiece extends Piece {
	constructor({ color, abbreviation, file, rank, id }: PieceProps) {
		super({ color, abbreviation, file, rank, id });
	}

	abstract moves({
		occupiedSquares,
		allPieces,
	}: MoveParams): number[][];

	/**
	 * Get the piece's moves
	 * @param moveDirections - the directions the piece can move
	 * @param occupiedSquares - the currently occupied squares
	 * @return moves - the moves of the piece as an array of co-ordinates (also an array)
	 */
	rangedMoves(moveDirections: number[][], occupiedSquares: (Piece | null)[][]): number[][] {
		const moves: number[][] = [];

		const rank = this._rank;
		const file = this._file;

		const pinDirection = this.getPinDirection(occupiedSquares);

		if (!pinDirection) {
			for (const direction of moveDirections) {
				moves.push(...this.moveOneWay(rank, file, direction[0], direction[1], false, occupiedSquares));
			}
	
			return moves;
		}

		const [ rankPinDirectionIn, filePinDirectionIn ] = pinDirection;
		const rankPinDirectionOut = rankPinDirectionIn * -1 ;
		const filePinDirectionOut = filePinDirectionIn * -1 ;

		for (const direction of moveDirections) {
			if ((direction[0] === rankPinDirectionIn && direction[1] === filePinDirectionIn) ||
				(direction[0] === rankPinDirectionOut && direction[1] === filePinDirectionOut)) {
				moves.push(...this.moveOneWay(rank, file, direction[0], direction[1], false, occupiedSquares));
			}
		}

		return moves;
	}

	/**
	 * Get the piece's moves in a particular direction, used for "ranged" pieces (bishop, queen and rook)
	 * @param file - the file that the piece is currently occupying: 1 - 8
	 * @param rank - the rank that the piece is currently occupying: 1 - 8
	 * @param f - the piece's movement between files: -1, 0, 1
	 * @param r - the piece's movement between ranks: -1, 0, 1
	 * @param isDefending - whether the move's being calculated are attacking or defending. Defending counts pieces of the same color guarded by the piece
	 * @param occupiedSquares - the currently occupied squares
	 * @return moves - the moves of the piece as an array of co-ordinates (also an array)
	 */
	moveOneWay(rank: number, file: number, r: number, f: number, isDefending: boolean, occupiedSquares: (Piece | null)[][]): number[][] {
		const moves = [];
		while (rank + r >= 1 && rank + r <= 8 && file + f >= 1 && file + f <= 8) {
			rank += r;
			file += f;
			const squareContent: Piece | null = occupiedSquares[rank - 1][file - 1];
			if (squareContent instanceof Piece) {
				if (isDefending || squareContent.color !== this.color) {
					moves.push([rank, file]);
				}
				break;
			}
			moves.push([rank, file]);
		}
		
		return moves;
	}

	/**
	 * Get the squares that the piece protects
	 * @param moveDirections - the directions the piece can move
	 * @param occupiedSquares - the squares that are currently occupied, array entries are piece names (eg wP3)
	 * @return protectedSquares - the squares that the piece protects as an array of co-ordinates (also an array)
	 */
	rangedProtectedSquares(moveDirections: number[][], occupiedSquares: (Piece | null)[][]): number[][] {
		const protectedSquares = [];

		const rank = this.rank;
		const file = this.file;

		for (const direction of moveDirections) {
			protectedSquares.push(...this.moveOneWay(rank, file, direction[0], direction[1], true, occupiedSquares));
		}

		return protectedSquares;
	}
}
