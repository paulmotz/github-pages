import { Piece } from './piece';
import { checkSquareOnBoard } from '../helpers';
import { pieceColors } from '@/lib/types';

export class Knight extends Piece {
	/**
	 * Get the Knight's possible moves
	 * @param file - file rank of the knight: 1 - 8
	 * @param rank - the rank of the knight: 1 - 8
	 * @return {Number[][]} moves - the moves of the Knight as an array of co-ordinates (also an array)
	 */
	getPossibleMoves(file: number, rank: number) {
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
	 * @return {Number[][]} moves - the moves of the Knight as an array of co-ordinates (also an array)
	 */
	moves(occupiedSquares: string[][]) {
		// pinned knights cannot move
		if (this.getPinDirection(occupiedSquares)) {
			return [];
		}
		
		const color: pieceColors = this._color;
		const file: number = this._file;
		const rank: number = this._rank;
		const possibleMoves: number[][] = this.getPossibleMoves(file, rank);

		// in addition to not being able to move off the board, a knight can only move to a square that is unoccupied or is occupied by a piece of the opposite color
		const moves = possibleMoves.filter((square) => {
			return checkSquareOnBoard(square) && 
				(!occupiedSquares[square[0]][square[1]] || occupiedSquares[square[0]][square[1]][0] !== color);
		});

		return moves;
	}

	/**
	 * Get the squares that the Knight protects
	 * @return {Number[][]} protectedSquares - the squares that the Knight protects as an array of co-ordinates (also an array)
	 */
	protectedSquares() {
		const file = this._file;
		const rank = this._rank;
		const possibleMoves = this.getPossibleMoves(file, rank);

		const protectedSquares = possibleMoves.filter(checkSquareOnBoard);

		return protectedSquares;
	}
}
