import { pieceAbbreviations, pieceColors, IPieceProps} from '@/lib/types';

export class Piece {
	_color : pieceColors;
	_abbreviation : pieceAbbreviations;
	_file : number;
	_rank : number;
	_id : number;

	/**
	 * Creates a piece of the given color at the given location
	 * @param color - The color of the piece: white || black
	 * @param abbreviation - The abbreviation of the piece: B, N, K, P, Q or R
	 * @param file - file rank of the piece: 1 - 8
	 * @param rank - the rank of the piece: 1 - 8
	 * @param id - the id of the piece: 1 - 10 (where 10 = max possible number of any given piece per color)
	 */
	constructor({color, abbreviation, file, rank, id}: IPieceProps) {
		this._color = color;
		this._abbreviation = abbreviation;
		this._file = file;
		this._rank = rank;
		this._id = id;
	}

	/**
	 * Get the piece's color
	 * @return { pieceColors } color - The color of the piece: white || black
	 */
	get color() {
		return this._color;
	}

	/**
	 * Get the piece's abbreviation
	 * @return { pieceAbbreviations } - The abbreviation of the piece: B, N, K, P, Q or R
	 */
	get abbr() {
		return this._abbreviation;
	}

	/**
	 * Get the piece's file
	 * @return { number } file - The file of the piece: 1 - 8
	 */
	get file() {
		return this._file;
	}

	/**
	 * Get the piece's rank
	 * @return { number } rank - The rank of the piece: 1 - 8
	 */
	get rank() {
		return this._rank;
	}

	/**
	 * Get the piece's id
	 * @return { number } id - The id of the piece: 1 - 10 (where 10 = max possible number of any given piece per color)
	 */
	get id() {
		return this._id;
	}

	/**
	 * Set the piece's color
	 * @param color - The color of the piece: white || black
	 */
	set color(color : pieceColors) {
		if (color === 'white' || color === 'black') {
			this._color = color;
		}
	}

	/**
	 * Set the piece's abbreviation
	 * @param abbreviation - The abbreviation of the piece: B, N, K, P, Q or R
	 */
	set abbreviation(abbreviation: pieceAbbreviations) {
		this._abbreviation = abbreviation;
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
	 * @param id - The id of the piece: 1 - 10 (where 10 = max possible number of any given piece per color)
	 */
	set id(id) {
		this._id = id;
	}

	/**
	 * Returns the direction of the king from the piece. Used for checking for pinned pieces
	 * @param occupiedSquares - the currently occupied squares
	 * @return { number[] } kingDirection - the direction of the king from the piece, null if another piece is in the way
	 */
	getKingDirection(occupiedSquares: string[][]) {
		let file = this.file;
		let rank = this.rank;
		const piece = occupiedSquares[file][rank];
		const pieceType = piece[1];
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
				if (occupiedSquares[file][rank]) {
					if (occupiedSquares[file][rank][0] === this.color && occupiedSquares[file][rank][1] === 'K') {
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
	}

	/**
	 * Checks to see if a piece is pinned and if so gets the direction of the pin
	 * @return { number[] } kingDirection - the direction of the king from the piece, null if another piece is in the way
	 * @return { number[] } pinDirection - the direciton of the pin (ie the direction which the piece may be able to move), null if no pin
	 */
	getPinDirection(occupiedSquares: string[][]) {
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
					const inlinePiece = occupiedSquares[file][rank];
					if (inlinePiece) {
						if (inlinePiece[0] !== this.color && (inlinePiece[1] === 'B' || inlinePiece[1] === 'Q')) {
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
					const inlinePiece = occupiedSquares[file][rank];
					if (inlinePiece) {
						if (inlinePiece[0] !== this.color && (inlinePiece[1] === 'R' || inlinePiece[1] === 'Q')) {
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