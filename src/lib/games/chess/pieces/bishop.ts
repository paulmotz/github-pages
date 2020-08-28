import { IPieceProps} from '@/lib/types';
import { RangedPiece } from './rangedPiece';

export class Bishop extends RangedPiece {
	_bishopDirections : number[][];

	constructor({ color, abbreviation, file, rank, id }: IPieceProps) {
		super({ color, abbreviation, file, rank, id });
		this._bishopDirections = [
			[-1, -1],
			[-1, +1],
			[+1, -1],
			[+1, +1],
		];
	}

	
	/**
	 * Get the piece's moves
	 * @param occupiedSquares - the currently occupied squares
	 * @return {Number[][]} moves - the moves of the piece as an array of co-ordinates (also an array)
	 */
	moves(occupiedSquares: string[][]) {
		return this.rangedMoves(this._bishopDirections, occupiedSquares);
	}

	/**
	 * Get the squares that the Bishop protects
	 * @param occupiedSquares - the squares that are currently occupied, array entries are piece names (eg wP3)
	 * @return {Number[][]} protectedSquares - the squares that the Bishop protects as an array of co-ordinates (also an array)
	 */
	protectedSquares(occupiedSquares: string[][]) {
		return this.rangedProtectedSquares(this._bishopDirections, occupiedSquares);
	}
}
