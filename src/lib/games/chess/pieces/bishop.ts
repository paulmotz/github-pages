import { PieceProps, MoveParams } from '@/lib/types';
import { Piece } from './piece';
import { RangedPiece } from './rangedPiece';

export class Bishop extends RangedPiece {
	_iconName: string;
	_bishopDirections: number[][];
	
	constructor({ color, abbreviation, rank, file, id }: PieceProps) {
		super({ color, abbreviation, rank, file, id });
		this._bishopDirections = [
			[-1, -1],
			[-1, +1],
			[+1, -1],
			[+1, +1],
		];
		this._iconName = 'chess-bishop';
	}
	
	/**
	 * Get the piece's moves
	 * @param occupiedSquares - the currently occupied squares
	 * @return moves - the moves of the piece as an array of co-ordinates (also an array)
	 */
	moves({ occupiedSquares }: MoveParams): number[][] {
		return this.rangedMoves(this._bishopDirections, occupiedSquares);
	}

	/**
	 * Get the squares that the Bishop protects
	 * @param occupiedSquares - the squares that are currently occupied, array entries are piece names (eg wP3)
	 * @return protectedSquares - the squares that the Bishop protects as an array of co-ordinates (also an array)
	 */
	protectedSquares(occupiedSquares: (Piece | null)[][]): number[][] {
		return this.rangedProtectedSquares(this._bishopDirections, occupiedSquares);
	}
}
