<template lang='pug'>
	.board(v-if="isInitialized")
		.border-row
			.border-cell
			.border-cell(v-for="(file, index) in files") {{ file }}
			.border-cell
		.game-row(v-for="rank, rankIndex in ranks")
			.border-cell {{ rank }}
			Square.game-cell(
				v-for="(file, fileIndex) in files"
				v-bind:fileIndex="fileIndex + 1"
				v-bind:rankIndex="rank"
				v-bind:isWhiteDown="isWhite"
				v-bind:piece="occupiedSquares[isWhite ? 7 - rankIndex : rankIndex][isWhite ? fileIndex : 7 - fileIndex]"
				v-bind:isHighlighted="possibleMoveSquares[isWhite ? 7 - rankIndex : rankIndex][isWhite ? fileIndex : 7 - fileIndex]"
				v-on:square-clicked="handleSquareClick")
			.border-cell {{ rank }}
		.border-row
			.border-cell
			.border-cell(v-for="(file, fileIndex) in files") {{ file }}
			.border-cell
</template>

<script lang="ts">
import Vue from 'vue';
import Square from '@/components/games/chess/Square.vue';
import { PieceColor, PieceType, SquareClickedEvent, PieceMove, SquareLocation } from '@/lib/types';
import { getPieceColor, getPieceName, pieceStartingPositions, pieceTypes } from '@/lib/games/chess/helpers';
import { pieceConstructors } from '@/lib/games/chess/setupHelpers';
import { Piece, Pawn, Rook, King } from '@/lib/games/chess/pieces';

export default Vue.extend({
	name : 'Board',

	components : {
		Square,
	},

	props : {
		isWhite : {
			type    : Boolean,
			default : true,
		},
	},

	data : function() {
		return {
			boardSize           : 8,
			moveCounter         : 0,
			gameStates          : [],
			occupiedSquares     : [] as (Piece | null)[][],
			possibleMoveSquares : [] as boolean[][],
			allPieces           : {} as {[index: string]: Piece[]},
			isInitialized       : false,
			selectedPiece       : null as Piece | null,
			isWhiteToMove       : true,
			inCheck             : false,
		};
	},

	computed : {
		files(): string[] {
			return this.isWhite
				? [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ]
				: [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ].reverse();
		},

		ranks(): number[] {
			return this.isWhite
				? [ 1, 2, 3, 4, 5, 6, 7, 8 ].reverse()
				: [ 1, 2, 3, 4, 5, 6, 7, 8 ];
		},

		isBoardSet(): boolean {
			return this.occupiedSquares.some(rank => {
				rank.some(square => square !== null);
			});
		},

		colorToMoveNext(): PieceColor {
			return this.isWhiteToMove ? 'white' : 'black';
		},
	},

	mounted() {
		this.initializePieces();
	},

	methods : {
		setEmptyStates(): void {
			for (let i = 0; i < this.boardSize; i++) {
				this.occupiedSquares.push(new Array(this.boardSize).fill(null));
				this.possibleMoveSquares.push(new Array(this.boardSize).fill(false));
			}
			for (const pieceType of pieceTypes) {
				this.allPieces[pieceType] = [];
			}
		},

		initializePieces(): void {
			this.setEmptyStates();

			for (const piece in pieceStartingPositions) {
				const color: PieceColor = getPieceColor(piece);
				const abbreviation: string = piece[1];
				const pieceName: string = getPieceName(abbreviation);

				for (const pieceStartingPositionIndex in pieceStartingPositions[piece]) {
					const [ rank, file ]: number[] = pieceStartingPositions[piece][pieceStartingPositionIndex];

					const newPiece: PieceType = new pieceConstructors[pieceName]({ color, abbreviation, rank, file, id : Number(pieceStartingPositionIndex)});

					this.allPieces[piece].push(newPiece);
					this.occupiedSquares[rank - 1][file - 1] = newPiece;
				}
			}
			this.isInitialized = true;
		},

		handleSquareClick({ square, rank, file }: SquareClickedEvent): void {
			this.getLegalMoves();

			if (this.selectedPiece !== null && this.possibleMoveSquares[rank - 1][file - 1]) {
				this.movePiece({ piece : this.selectedPiece, rank, file });
				return;
			}
			this.resetMoveSquares();

			if (square === null || this.selectedPiece === square || this.colorToMoveNext !== square.color) {
				this.selectedPiece = null;
				return;
			}

			const moves: number[][] = square.moves(this.occupiedSquares);

			if (moves.length) {
				this.setMoveSquares(moves);
			}

			this.selectedPiece = square;
		},

		movePiece({ piece, rank, file }: PieceMove): void {
			const currentPieceRank = piece.rank;
			const currentPieceFile = piece.file;
			const currentPieceRow: (Piece | null)[] = this.occupiedSquares[currentPieceRank - 1].slice(0);
			currentPieceRow[currentPieceFile - 1] = null;
			this.$set(this.occupiedSquares, currentPieceRank - 1, currentPieceRow);

			// HACK: Change this once board states are kept track of
			if (piece instanceof Pawn && Math.abs(piece.rank - rank) === 2) {
				piece.canBeCapturedByEnPassant = true;
			}

			piece.rank = rank;
			piece.file = file;
			if (piece instanceof Rook || piece instanceof King) {
				piece.hasMoved = true;
			}


			const newSquareContents: Piece | null = this.occupiedSquares[rank - 1][file - 1];
			if (newSquareContents !== null) {
				this.capturePiece(newSquareContents);
			}

			const adjacentSquareRank = this.isWhiteToMove ? rank - 2 : rank;
			const adjacentSquareContents: Piece | null = this.occupiedSquares[adjacentSquareRank][file - 1];
			if (adjacentSquareContents instanceof Pawn && adjacentSquareContents.canBeCapturedByEnPassant) {
				this.capturePieceByEnPassant(adjacentSquareContents);
			}

			const newPieceRow: (Piece | null)[] = this.occupiedSquares[rank - 1].slice(0);
			newPieceRow[file - 1] = piece;
			this.$set(this.occupiedSquares, rank - 1, newPieceRow);

			this.selectedPiece = null;
			this.resetMoveSquares();

			this.setNextPlayerTurn();
		},

		capturePiece(piece: Piece): void {
			const pieceType = `${piece.color[0]}${piece.abbreviation}`;
			const pieceIndexToCapture = this.allPieces[pieceType].findIndex((p: Piece) => Number(p.id) === Number(piece.id));
			this.allPieces[pieceType].splice(pieceIndexToCapture, 1);
		},

		capturePieceByEnPassant(piece: Piece): void {
			this.capturePiece(piece);
			const newPieceRow: (Piece | null)[] = this.occupiedSquares[piece.rank - 1].slice(0);
			newPieceRow[piece.file - 1] = null;
			this.$set(this.occupiedSquares, piece.rank - 1, newPieceRow);
		},

		setMoveSquares(moves: number[][]): void {
			for (const move of moves) {
				const newRow: boolean[] = this.possibleMoveSquares[move[0] - 1].slice(0);
				newRow[move[1] - 1] = true;
				this.$set(this.possibleMoveSquares, move[0] - 1, newRow);
			}
		},

		resetMoveSquares(): void {
			for (const row in this.possibleMoveSquares) {
				this.$set(this.possibleMoveSquares, row, new Array(this.boardSize).fill(false));
			}
		},

		setNextPlayerTurn(): void {
			this.resetEnPassant();
			this.inCheck = false;
			this.isWhiteToMove = !this.isWhiteToMove;
		},

		resetEnPassant(): void {
			if (this.isWhiteToMove) {
				for (const pawn of this.allPieces.bP) {
					if (pawn instanceof Pawn) {
						pawn.canBeCapturedByEnPassant = false;
					}
				}
			} else {
				for (const pawn of this.allPieces.wP) {
					if (pawn instanceof Pawn) {
						pawn.canBeCapturedByEnPassant = false;
					}
				}
			}
		},

		getLegalMoves(): moves {
			const checkingPieces = this.getCheckingPieces(this.colorToMoveNext);

			console.log(this.allPieces);
			console.log(checkingPieces);
			const moves = [];
			for (const pieceTypeAndColor in this.allPieces) {
				for (const piece of this.allPieces[pieceTypeAndColor]) {
					// console.log(piece);
					// moves.push(piece.moves(this.occupiedSquares));
				}
			}
			return [];
		},

		getKingLocation(color: PieceColor): SquareLocation {
			const [ king ] = this.allPieces[`${color[0]}K`];
			return {
				rank : king.rank,
				file : king.file,
			};
		},

		getCheckingPieces(color: PieceColor): Piece[] {
			const checkingPieces: Piece[] = [];
			const kingLocation = this.getKingLocation(color);

			for (const pieceTypeAndColor in this.allPieces) {
				for (const piece of this.allPieces[pieceTypeAndColor]) {
					if (!(piece instanceof King) && piece.color !== color) {
						if (piece.protectedSquares(this.occupiedSquares).find(square =>
							square[0] === kingLocation.rank && square[1] === kingLocation.file,
						)) {
							checkingPieces.push(piece);
						}
					}
				}
			}

			return checkingPieces;
		},
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='stylus'>
@import '../../../assets/variables.styl'

.chess
	height: 100%
	display: flex
	align-items: center
	align-content: center
	justify-content: center
	text-align: center

.border-row, .game-row
	display: flex
	align-items: center
	align-content: center

.border-cell, .game-cell
	height: 40px
	width: 40px
	line-height: 40px

.border-cell
	display: block
	background-color: $board-border
	text-align: center
	color: white
</style>
