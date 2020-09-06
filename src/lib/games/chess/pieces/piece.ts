import { PieceAbbreviation, PieceColor, PieceProps, MoveParams } from '@/lib/types';

export abstract class Piece {
	_color: PieceColor;
	_abbreviation: PieceAbbreviation;
	_file: number;
	_rank: number;
	_id: number;
	_iconName: string;

	/**
	 * Creates a piece of the given color at the given location
	 * @param color - The color of the piece: white || black
	 * @param abbreviation - The abbreviation of the piece: B, N, K, P, Q or R
	 * @param file - file rank of the piece: 1 - 8
	 * @param rank - the rank of the piece: 1 - 8
	 * @param id - the id of the piece: 1 - 10 (where 10 = max possible number of any given piece per color)
	 */
	constructor({ color, abbreviation, file, rank, id }: PieceProps) {
		this._color = color;
		this._abbreviation = abbreviation;
		this._file = file;
		this._rank = rank;
		this._id = id;
		this._iconName = '';
	}

	/**
	 * Get the piece's color
	 * @return color - The color of the piece: white || black
	 */
	get color(): PieceColor {
		return this._color;
	}

	/**
	 * Set the piece's color
	 * @param color - The color of the piece: white || black
	 */
	set color(color: PieceColor) {
		if (color === 'white' || color === 'black') {
			this._color = color;
		}
	}

	/**
	 * Get the piece's file
	 * @return  file - The file of the piece: 1 - 8
	 */
	get file(): number {
		return this._file;
	}

	/**
	 * Set the piece's color
	 * @param file - The file of the piece: 1 - 8
	 */
	set file(file: number) {
		if (file > 0 && file < 9) {
			this._file = file;
		}
	}


	/**
	 * Get the piece's rank
	 * @return rank - The rank of the piece: 1 - 8
	 */
	get rank(): number {
		return this._rank;
	}

	/**
	 * Set the piece's rank
	 * @param rank - The rank of the piece: 1 - 8
	 */
	set rank(rank) {
		if (rank > 0 && rank < 9) {
			this._rank = rank;
		}
	}

	/**
	 * Get the piece's id
	 * @return id - The id of the piece: 1 - 10 (where 10 = max possible number of any given piece per color)
	 */
	get id(): number {
		return this._id;
	}

	/**
	 * Get the piece's id
	 * @param id - The id of the piece: 1 - 10 (where 10 = max possible number of any given piece per color)
	 */
	set id(id) {
		this._id = id;
	}

	/**
	 * Get the piece's icon
	 * @return id - The name of the fa icon
	 */
	get iconName(): string {
		return this._iconName;
	}

	/**
	 * Set the piece's abbreviation
	 * @param abbreviation - The abbreviation of the piece: B, N, K, P, Q or R
	 */
	set abbreviation(abbreviation: PieceAbbreviation) {
		this._abbreviation = abbreviation;
	}

	/**
	 * Get the piece's abbreviation
	 * @return The abbreviation of the piece: B, N, K, P, Q or R
	 */
	get abbreviation(): PieceAbbreviation {
		return this._abbreviation;
	}

	abstract moves( {
		occupiedSquares,
		allPieces,
	}: MoveParams): number[][];

	abstract protectedSquares(occupiedSquares?: (Piece | null)[][]): number[][];

	/**
	 * Returns the direction of the king from the piece. Used for checking for pinned pieces
	 * @param occupiedSquares - the currently occupied squares
	 * @return kingDirection - the direction of the king from the piece, null if another piece is in the way
	 */
	getKingDirection(occupiedSquares: (Piece | null)[][]): number[] | null {
		let rank = this.rank;
		let file = this.file;
		const piece: Piece | null = occupiedSquares[rank - 1][file - 1];
		if (piece === null) {
			return null;
		}
		const pieceType = piece.abbreviation;
		if (pieceType === 'K') {
			return null; // TODO: maybe this should be a special value
		}
		const directions = [
			[-1,  1], [0,  1], [1,  1],
			[-1,  0],          [1,  0],
			[-1, -1], [0, -1], [1, -1],
		];

		for (const currDir of directions) {
			const [r, f] = currDir;
			while (file + f >= 1 && file + f <= 8 && rank + r >= 1 && rank + r <= 8) {
				rank += r;
				file += f;
				const squareContent: Piece | null = occupiedSquares[rank - 1][file - 1];
				if (squareContent instanceof Piece) {
					if (squareContent.color === this.color && squareContent.abbreviation === 'K') {
						return currDir;
					} 
					else {
						break;
					}
				}
			}
			rank = this.rank;
			file = this.file;
		}

		return null;
	}

	/**
	 * Checks to see if a piece is pinned and if so gets the direction of the pin
	 * @return pinDirection - the direciton of the pin (ie the direction which the piece may be able to move), null if no pin
	 */
	getPinDirection(occupiedSquares: (Piece | null)[][]): number[] | undefined {
		const kd = this.getKingDirection(occupiedSquares);
		if (!kd) {
			return;
		}

		else {
			let rank = this.rank;
			let file = this.file;
			const r = kd[0] === 0 ? kd[0] : -kd[0];
			const f = kd[1] === 0 ? kd[1] : -kd[1];

			// diagonal move
			if ((r + f) % 2 === 0) {
				while (rank + r >= 1 && rank + r <= 8 && file + f >= 1 && file + f <= 8) {
					rank += r;
					file += f;
					const inlinePiece: Piece | null = occupiedSquares[rank - 1][file - 1];
					if (inlinePiece instanceof Piece) {
						if (inlinePiece.color !== this.color && (inlinePiece.abbreviation === 'B' || inlinePiece.abbreviation === 'Q')) {
							return [r, f];
						} 
						else {
							break;
						}
					} 
				}
			}

			// horizontal/vertical move
			else {
				while (rank + r >= 1 && rank + r <= 8 && file + f >= 1 && file + f <= 8) {
					rank += r;
					file += f;
					const inlinePiece: Piece | null = occupiedSquares[rank - 1][file - 1];
					if (inlinePiece instanceof Piece) {
						if (inlinePiece.color !== this.color && (inlinePiece.abbreviation === 'R' || inlinePiece.abbreviation === 'Q')) {
							return [r, f];
						} 
						else {
							break;
						}
					} 
				}
			}
		}
	}
}
