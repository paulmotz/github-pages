import { PieceProps, MoveParams } from '@/lib/types';
import { Piece } from './piece';
import { RangedPiece } from './rangedPiece';

export class Rook extends RangedPiece {
	_iconName: string;
	_rookDirections: number[][];
	_hasMoved: boolean;

	constructor({ color, abbreviation, file, rank, id, hasMoved }: PieceProps) {
		super({ color, abbreviation, file, rank, id });
		this._rookDirections = [
			[-1, 0], 
			[+1, 0],
			[0, -1],
			[0, +1],
		];
		this._hasMoved = hasMoved || false;
		this._iconName = 'chess-rook';
	}

	/**
	 * Get whether the rook has moved
	 */
	get hasMoved(): boolean {
		return this._hasMoved;
	}

	/**
	 * Keep track of whether the rook has moved
	 */
	set hasMoved(hasMoved) {
		this._hasMoved = hasMoved;
	}

	/**
	 * Get the piece's moves
	 * @param occupiedSquares - the currently occupied squares
	 * @return moves - the moves of the piece as an array of co-ordinates (also an array)
	 */
	moves({ occupiedSquares }: MoveParams): number[][] {
		return this.rangedMoves(this._rookDirections, occupiedSquares);
	}

	/**
	 * Get the squares that the Bishop protects
	 * @param occupiedSquares - the squares that are currently occupied, array entries are piece names (eg wP3)
	 * @return protectedSquares - the squares that the Bishop protects as an array of co-ordinates (also an array)
	 */
	protectedSquares(occupiedSquares: (Piece | null)[][]): number[][] {
		return this.rangedProtectedSquares(this._rookDirections, occupiedSquares);
	}
}
