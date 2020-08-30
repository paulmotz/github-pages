import { Piece } from './piece';
import { isSquareOnBoard } from '../helpers';
import { pieceColors, PieceProps } from '@/lib/types';

export class Knight extends Piece {
	_iconName: string;

	constructor({ color, abbreviation, file, rank, id }: PieceProps) {
		super({ color, abbreviation, file, rank, id });
		this._iconName = 'chess-knight';
	}

	/**
	 * Get the Knight's possible moves
	 * @param file - file rank of the knight: 1 - 8
	 * @param rank - the rank of the knight: 1 - 8
	 * @return moves - the moves of the Knight as an array of co-ordinates (also an array)
	 */
	getPossibleMoves(file: number, rank: number): number[][] {
		return [
			[file - 1, rank + 2], [file + 1, rank + 2], 
			[file - 2, rank + 1], [file + 2, rank + 1],                       
			[file - 2, rank - 1], [file + 2, rank - 1], 
			[file - 1, rank - 2], [file + 1, rank - 2], 
		];
	}

	/**
	 * Get the Knight's moves
	 * @param occupiedSquares - the currently occupied squares
	 * @return moves - the moves of the Knight as an array of co-ordinates (also an array)
	 */
	moves(occupiedSquares: Piece[][]): number[][] {
		// pinned knights cannot move
		if (this.getPinDirection(occupiedSquares)) {
			return [];
		}
		
		const color: pieceColors = this._color;
		const rank: number = this._rank;
		const file: number = this._file;
		const possibleMoves: number[][] = this.getPossibleMoves(rank, file);

		// in addition to not being able to move off the board, a knight can only move to a square that is unoccupied or is occupied by a piece of the opposite color
		const moves = possibleMoves.filter((square) => {
			return isSquareOnBoard(square) && 
				(!occupiedSquares[square[0] - 1][square[1] - 1] || occupiedSquares[square[0] - 1][square[1] - 1].color !== color);
		});

		return moves;
	}

	/**
	 * Get the squares that the Knight protects
	 * @return protectedSquares - the squares that the Knight protects as an array of co-ordinates (also an array)
	 */
	protectedSquares(): number[][] {
		const rank = this.rank;
		const file = this.file;
		const possibleMoves = this.getPossibleMoves(file, rank);

		const protectedSquares = possibleMoves.filter(isSquareOnBoard);

		return protectedSquares;
	}
}
