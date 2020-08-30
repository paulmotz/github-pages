import { Piece, Rook } from '@/lib/games/chess/pieces';
import { PieceColor, AttackedSquares, AllPieces, PieceProps, MoveParams } from '@/lib/types';
import { isSquareOnBoard, findPieceIndex, getOtherColor } from '@/lib/games/chess/helpers';

export class King extends Piece {
	_hasMoved: boolean;
	_iconName: string;

	// TODO:
	// check if the piece is in check
	// restrict move if move would place the king in check

	/*
	 * Creates a king of the given color at the given location
	 * @param color - The color of the king: white || black
	 * @param abbreviation - The abbreviation of the piece: K for King
	 * @param file - file rank of the king: 1 - 8
	 * @param rank - the rank of the king: 1 - 8
	 * @param hasMoved - whether or not the king has moved (used for checking if castling is possible)
	 */
	constructor({ color, abbreviation, file, rank, id, hasMoved}: PieceProps) {
		super({ color, abbreviation, file, rank, id });
		this._hasMoved = hasMoved || false;
		this._iconName = 'chess-king';
	}
	
	/**
	 * Get the Kings's possible moves
	 * @param file - file rank of the king: 1 - 8
	 * @param rank - the rank of the king: 1 - 8
	 * @return moves - the moves of the king as an array of co-ordinates (also an array)
	 */
	getPossibleMoves(file: number, rank: number): number[][] {
		return [
			[file - 1,rank + 1],
			[file, rank + 1],
			[file + 1, rank + 1],
			[file - 1, rank],
			[file + 1, rank],
			[file - 1, rank - 1],
			[file, rank - 1],
			[file + 1, rank - 1],
		];
	}

	/**
	 * Get the King's moves
	 * @param occupiedSquares - the currently occupied squares
	 * @param attackedSquares - the squares the opponent is attacking
	 * @param allPieces - all pieces on the board
	 * @return moves - the moves of the King as an array of co-ordinates (also an array)
	 */
	moves({
		occupiedSquares,
		attackedSquares,
		allPieces,
	}: MoveParams): number[][] {
		if (!attackedSquares || !allPieces) {
			return [];
		}

		const color: PieceColor = this._color;
		const opponentColor: PieceColor = getOtherColor(color);
		const file: number = this._file;
		const rank: number = this._rank;
		const hasMoved: boolean = this._hasMoved;
		const possibleMoves: number[][] = this.getPossibleMoves(file, rank);

		const moves = possibleMoves.filter((square) => {
			const potentialSquare = occupiedSquares[square[0]][square[1]];

			return isSquareOnBoard(square) &&
				(potentialSquare === null || potentialSquare.color !== color) &&
				!attackedSquares[opponentColor].has(square);
		});

		const colorRook: string = color + 'R';
		const queensideRook = allPieces[colorRook][findPieceIndex(allPieces, colorRook, 0)];

		// queenside castling
		if (queensideRook instanceof Rook && !hasMoved && queensideRook && !queensideRook.hasMoved &&
			!occupiedSquares[file - 1][rank] && !occupiedSquares[file - 2][rank] && !occupiedSquares[file - 3][rank] &&
			!attackedSquares[opponentColor].has([file, rank]) && !attackedSquares[opponentColor].has([file - 1, rank]) && !attackedSquares[opponentColor].has([file - 2, rank])) {
			moves.push([file - 2, rank]);
		}

		const kingsideRook = allPieces[colorRook][findPieceIndex(allPieces, colorRook, 1)];

		// kingside castling
		if (kingsideRook instanceof Rook && !hasMoved && kingsideRook && !kingsideRook.hasMoved &&
			!occupiedSquares[file + 1][rank] && !occupiedSquares[file + 2][rank] &&
			!attackedSquares[opponentColor].has([file, rank]) && !attackedSquares[opponentColor].has([file + 1, rank]) && !attackedSquares[opponentColor].has([file + 2, rank])) {
			moves.push([file + 2, rank]);
		}

		return moves;
	}

	/**
	 * Get the squares that the King protects
	 * @return protectedSquares - the squares that the King protects as an array of co-ordinates (also an array)
	 */
	protectedSquares(): number[][] {
		const file = this._file;
		const rank = this._rank;
		const possibleMoves = this.getPossibleMoves(file, rank);

		// only need to check if square is on the board
		const protectedSquares = possibleMoves.filter(isSquareOnBoard);

		return protectedSquares;
	}

	/**
	 * Get whether the king has moved
	 */
	get hasMoved(): boolean {
		return this._hasMoved;
	}

	/**
	 * Keep track of whether the king has moved
	 */
	set hasMoved(hasMoved) {
		this._hasMoved = hasMoved;
	}
}
