import { PieceAbbreviation, PieceColor, PieceProps, AttackedSquares, AllPieces } from '@/lib/types';

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

	abstract moves(occupiedSquares: (Piece | null)[][], attackedSquares?: AttackedSquares, allPieces?: AllPieces): number[][]

	/**
	 * Returns the direction of the king from the piece. Used for checking for pinned pieces
	 * @param occupiedSquares - the currently occupied squares
	 * @return kingDirection - the direction of the king from the piece, null if another piece is in the way
	 */
	getKingDirection(occupiedSquares: Piece[][]): number[] | null {
		let rank = this.rank;
		let file = this.file;
		const piece: Piece = occupiedSquares[rank - 1][file - 1];
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
			const [f, r] = currDir;
			while (file + f >= 1 && file + f <= 8 && rank + r >= 1 && rank + r <= 8) {
				file += f;
				rank += r;
				if (occupiedSquares[rank - 1][file - 1]) {
					if (occupiedSquares[rank - 1][file - 1].color === this.color && occupiedSquares[rank - 1][file - 1].abbreviation === 'K') {
						return currDir;
					} 
					else {
						break;
					}
				}
			}
			file = this.file;
			rank = this.rank;
		}

		return null;
	}

	/**
	 * Checks to see if a piece is pinned and if so gets the direction of the pin
	 * @return pinDirection - the direciton of the pin (ie the direction which the piece may be able to move), null if no pin
	 */
	getPinDirection(occupiedSquares: Piece[][]): number[] | undefined {
		const kd = this.getKingDirection(occupiedSquares);
		if (!kd) return;
		else {
			let file = this.file;
			let rank = this.rank;
			const f = -kd[0];
			const r = -kd[1];

			// diagonal move
			if ((f + r) % 2 === 0) {
				while (file + f >= 1 && file + f <= 8 && rank + r >= 1 && rank + r <= 8) {
					file += f;
					rank += r;
					const inlinePiece: Piece = occupiedSquares[rank - 1][file - 1];
					if (inlinePiece) {
						if (inlinePiece.color !== this.color && (inlinePiece.abbreviation === 'B' || inlinePiece.abbreviation === 'Q')) {
							return [f, r];
						} 
						else {
							break;
						}
					} 
				}
			}

			// horizontal/vertical move
			else {
				while (file + f >= 1 && file + f <= 8 && rank + r >= 1 && rank + r <= 8) {
					file += f;
					rank += r;
					const inlinePiece: Piece = occupiedSquares[rank - 1][file - 1];
					if (inlinePiece) {
						if (inlinePiece.color !== this.color && (inlinePiece.abbreviation === 'R' || inlinePiece.abbreviation === 'Q')) {
							return [f, r];
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
