import { Piece, Pawn, Knight, Bishop, Rook, Queen, King } from '@/lib/games/chess/pieces';
import { IAllPieces, IPieceStartingPositions, pieceColors, allPieceTypes } from '@/lib/types';
import { getPieceColor, getPieceName, pieceConstructors } from './helpers';

export const allPieces: IAllPieces = {
	'wB' : [],
	'wN' : [],
	'wK' : [],
	'wP' : [],
	'wQ' : [],
	'wR' : [],
	'bB' : [],
	'bN' : [],
	'bK' : [],
	'bP' : [],
	'bQ' : [],
	'bR' : [],
};

export const pieceStartingPositions: IPieceStartingPositions = {
	'wB' : [ [3, 1], [6, 1] ],
	'wN' : [ [2, 1], [7, 1] ],
	'wK' : [ [5, 1] ],
	'wP' : [ [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2] ],
	'wQ' : [ [4, 1] ],
	'wR' : [ [1, 1], [8, 1] ],
	'bB' : [ [3, 8], [6, 8] ],
	'bN' : [ [2, 8], [7, 8] ],
	'bK' : [ [5, 8]] ,
	'bP' : [ [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7]] ,
	'bQ' : [ [4, 8] ],
	'bR' : [ [1, 8], [8, 8] ],
};

export const occupiedSquares : (Piece | null) [][] = [
	// [ 'wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR' ],
	// [ 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP' ],
	[ null, null, null, null, null, null, null, null ],
	[ null, null, null, null, null, null, null, null ],
	[ null, null, null, null, null, null, null, null ],
	[ null, null, null, null, null, null, null, null ],
	[ null, null, null, null, null, null, null, null ],
	[ null, null, null, null, null, null, null, null ],
	[ null, null, null, null, null, null, null, null ],
	[ null, null, null, null, null, null, null, null ],
	// [ 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP' ],
	// [ 'bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR' ],
];

// const newGame = () => {
// 	moveCounter = 0;
// };

export class Game {
	_moveCounter : number;
	_gameStates : Array<number>; // TODO: make this an array of states
	_pieces : Object;

	constructor() {
		this._moveCounter = 0;
		this._gameStates = [];
		this._pieces = this.getInitalPiecesState();
	}

	private getInitalPiecesState = () => {
		console.log(123);
		for (const piece in pieceStartingPositions) {
			allPieces[piece] = []; 
			const color: pieceColors = getPieceColor(piece);
			const abbreviation: string = piece[1];
			const pieceName: string = getPieceName(abbreviation);

			for (const pieceStartingPositionIndex in pieceStartingPositions[piece]) {
				const [ file, rank ]: number[] = pieceStartingPositions[piece][pieceStartingPositionIndex];

				const newPiece: allPieceTypes = new pieceConstructors[pieceName]({ color, abbreviation, file, rank, id : pieceStartingPositionIndex});

				allPieces[piece].push(newPiece);
				occupiedSquares[rank - 1][file - 1] = newPiece;
			}
		}

		return allPieces;
	}
}