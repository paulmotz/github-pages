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
import { pieceColors, allPieceTypes, SquareClickedEvent, PieceMove } from '@/lib/types';
import { getPieceColor, getPieceName, pieceStartingPositions } from '@/lib/games/chess/helpers';
import { pieceConstructors } from '@/lib/games/chess/setupHelpers';
import { Piece } from '@/lib/games/chess/pieces';

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
			moveCounter     : 0,
			gameStates      : [],
			occupiedSquares : [
				[ null, null, null, null, null, null, null, null ],
				[ null, null, null, null, null, null, null, null ],
				[ null, null, null, null, null, null, null, null ],
				[ null, null, null, null, null, null, null, null ],
				[ null, null, null, null, null, null, null, null ],
				[ null, null, null, null, null, null, null, null ],
				[ null, null, null, null, null, null, null, null ],
				[ null, null, null, null, null, null, null, null ],
			],
			possibleMoveSquares : [
				[ false, false, false, false, false, false, false, false ],
				[ false, false, false, false, false, false, false, false ],
				[ false, false, false, false, false, false, false, false ],
				[ false, false, false, false, false, false, false, false ],
				[ false, false, false, false, false, false, false, false ],
				[ false, false, false, false, false, false, false, false ],
				[ false, false, false, false, false, false, false, false ],
				[ false, false, false, false, false, false, false, false ],
			],
			allPieces : {
				'wB' : [],
				'wN' : [],
				'wK' : [],
				'wP' : [],
				'wQ' : [],
				'wR' : [],
				'bB' : [],
				'bN' : [],
				'bK' : [] ,
				'bP' : [] ,
				'bQ' : [],
				'bR' : [],
			},
			isInitialized : false,
			selectedPiece : null,
			isWhitetoMove : true,
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

		colorToMoveNext(): pieceColors {
			return this.isWhitetoMove ? 'white' : 'black';
		},
	},

	mounted() {
		this.initializePieces();
	},

	methods : {
		initializePieces(): void {
			for (const piece in pieceStartingPositions) {
				const color: pieceColors = getPieceColor(piece);
				const abbreviation: string = piece[1];
				const pieceName: string = getPieceName(abbreviation);

				for (const pieceStartingPositionIndex in pieceStartingPositions[piece]) {
					const [ rank, file ]: number[] = pieceStartingPositions[piece][pieceStartingPositionIndex];

					const newPiece: allPieceTypes = new pieceConstructors[pieceName]({ color, abbreviation, rank, file, id : Number(pieceStartingPositionIndex)});

					this.allPieces[piece].push(newPiece);
					this.occupiedSquares[rank - 1][file - 1] = newPiece;
				}
			}
			this.isInitialized = true;
		},

		handleSquareClick({ piece, rank, file }: SquareClickedEvent): void {
			if (this.selectedPiece !== null && this.possibleMoveSquares[rank - 1][file - 1]) {
				this.movePiece({ piece : this.selectedPiece, rank, file });
				return;
			}
			this.resetMoveSquares();

			if (piece === null || this.selectedPiece === piece || this.colorToMoveNext !== piece.color) {
				this.selectedPiece = null;
				return;
			}

			const moves: number[][] = piece.moves(this.occupiedSquares);

			if (moves.length) {
				this.setMoveSquares(moves);
			}

			this.selectedPiece = piece;
		},

		movePiece({ piece, rank, file }: PieceMove): void {
			const currentPieceRank = piece.rank;
			const currentPieceFile = piece.file;
			const currentPieceRow: (Piece | null)[] = this.occupiedSquares[currentPieceRank - 1].slice(0);
			currentPieceRow[currentPieceFile - 1] = null;
			this.$set(this.occupiedSquares, currentPieceRank - 1, currentPieceRow);

			piece.rank = rank;
			piece.file = file;

			const newSquareContents: Piece | null = this.occupiedSquares[rank - 1][file - 1];
			const isPieceOnNewSquare: boolean = newSquareContents !== null;

			if (isPieceOnNewSquare) {
				this.capturePiece(newSquareContents);
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
			// const pieceToRemove
			const pieceIndexToCapture = this.allPieces[pieceType].findIndex(p => Number(p.id) === Number(piece.id));
			this.allPieces[pieceType].splice(pieceIndexToCapture, 1);
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
				this.$set(this.possibleMoveSquares, row, new Array(8).fill(false));
			}
		},

		setNextPlayerTurn(): void {
			this.isWhitetoMove = !this.isWhitetoMove;
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

