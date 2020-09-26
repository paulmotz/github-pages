import { Piece, Rook } from '@/lib/games/chess/pieces';
import { PieceColor, PieceProps, MoveParams } from '@/lib/types';
import { isSquareOnBoard, findPieceIndex, getOtherColor, getAttackedSquares } from '@/lib/games/chess/helpers';
import { isSquareAttacked } from '@/lib/games/chess/checkingHelpers';

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
	 * @param rank - the rank of the king: 1 - 8
	 * @param file - file rank of the king: 1 - 8
	 * @param hasMoved - whether or not the king has moved (used for checking if castling is possible)
	 */
	constructor({ color, abbreviation, rank, file, id, hasMoved}: PieceProps) {
		super({ color, abbreviation, rank, file, id });
		this._hasMoved = hasMoved || false;
		this._iconName = 'chess-king';
	}
	
	/**
	 * Get the Kings's possible moves
	 * @param rank - the rank of the king: 1 - 8
	 * @param file - the file of the king: 1 - 8
	 * @return moves - the moves of the king as an array of co-ordinates (also an array)
	 */
	getPossibleMoves(rank: number, file: number): number[][] {
		return [
			[rank - 1, file + 1],
			[rank, file + 1],
			[rank + 1, file + 1],
			[rank - 1, file],
			[rank + 1, file],
			[rank - 1, file - 1],
			[rank, file - 1],
			[rank + 1, file - 1],
		];
	}

	/**
	 * Get the King's moves
	 * @param occupiedSquares - the currently occupied squares
	 * @param allPieces - all pieces on the board
	 * @return moves - the moves of the King as an array of co-ordinates (also an array)
	 */
	moves({
		occupiedSquares,
		allPieces,
	}: MoveParams): number[][] {
		if (!allPieces) {
			return [];
		}

		const color: PieceColor = this.color;
		const opponentColor: PieceColor = getOtherColor(color);
		const attackedSquares = getAttackedSquares(allPieces, occupiedSquares, opponentColor);

		const file: number = this.file;
		const rank: number = this.rank;
		const hasMoved: boolean = this.hasMoved;
		const possibleMoves: number[][] = this.getPossibleMoves(rank, file);

		const moves = possibleMoves.filter((square) => {
			// This check should be done separately so that targetSquare can be stored in a variable to ensure that it is not null
			if (!isSquareOnBoard(square)) {
				return false;
			}
			
			const potentialSquare = occupiedSquares[square[0] - 1][square[1] - 1];
			
			return (potentialSquare === null || potentialSquare.color !== color) &&
				!isSquareAttacked(square, attackedSquares);
		});

		const colorRook: string = color[0] + 'R';
		const queensideRook = allPieces[colorRook][findPieceIndex(allPieces, colorRook, 0)];

		// queenside castling
		if (queensideRook instanceof Rook && !hasMoved && queensideRook && !queensideRook.hasMoved &&
			!occupiedSquares[rank - 1][file - 2] && !occupiedSquares[rank - 1][file - 3] && !occupiedSquares[rank - 1][file - 4] &&
			!isSquareAttacked([rank, file], attackedSquares) && !isSquareAttacked([rank, file - 1], attackedSquares) && !isSquareAttacked([rank, file - 1], attackedSquares)) {
			moves.push([rank, file - 2]);
		}

		const kingsideRook = allPieces[colorRook][findPieceIndex(allPieces, colorRook, 1)];

		// kingside castling
		if (kingsideRook instanceof Rook && !hasMoved && kingsideRook && !kingsideRook.hasMoved &&
			!occupiedSquares[rank - 1][file] && !occupiedSquares[rank - 1][file + 1] &&
			!isSquareAttacked([rank, file], attackedSquares) && !isSquareAttacked([rank, file + 1], attackedSquares) && !isSquareAttacked([rank, file + 2], attackedSquares)) {
			moves.push([rank, file + 2]);
		}

		return moves;
	}

	/**
	 * Get the squares that the King protects
	 * @return protectedSquares - the squares that the King protects as an array of co-ordinates (also an array)
	 */
	protectedSquares(): number[][] {
		const rank = this._rank;
		const file = this._file;
		const possibleMoves = this.getPossibleMoves(rank, file);

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
