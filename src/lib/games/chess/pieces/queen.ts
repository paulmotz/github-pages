import { PieceProps} from '@/lib/types';
import { Piece } from './piece';
import { RangedPiece } from './rangedPiece';

export class Queen extends RangedPiece {
	_queenDirections: number[][];
	_iconName: string;

	constructor({ color, abbreviation, file, rank, id }: PieceProps) {
		super({ color, abbreviation, file, rank, id });
		this._queenDirections = [
			[-1, 0],
			[+1, 0],
			[0, -1],
			[0, +1],
			[-1, -1],
			[-1, +1],
			[+1, -1],
			[+1, +1],
		];
		this._iconName = 'chess-queen';
	}

	/**
	 * Get the piece's moves
	 * @param occupiedSquares - the currently occupied squares
	 * @return moves - the moves of the piece as an array of co-ordinates (also an array)
	 */
	moves(occupiedSquares: Piece[][]): number[][] {
		return this.rangedMoves(this._queenDirections, occupiedSquares);
	}

	/**
	 * Get the squares that the Queen protects
	 * @param occupiedSquares - the squares that are currently occupied, array entries are piece names (eg wP3)
	 * @return {protectedSquares - the squares that the Queen protects as an array of co-ordinates (also an array)
	 */
	protectedSquares(occupiedSquares: Piece[][]): number[][] {
		return this.rangedProtectedSquares(this._queenDirections, occupiedSquares);
	}
}
