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
				v-bind:key="fileIndex"
				v-bind:fileIndex="fileIndex + 1"
				v-bind:rankIndex="rank"
				v-bind:isWhiteDown="isWhite"
				v-bind:colorToMoveNext="colorToMoveNext"
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
import { PieceColor, SquareClickedEvent, PieceMove, PieceAbbreviation } from '@/lib/types';
import { pieceStartingPositions, findPieceIndex, pieceTypes, initializeBoard, findPawnToPromoteLocation, getPromotionPiece } from '@/lib/games/chess/helpers';
import { getCheckingPieces, getLegalMoves, isCheckmate } from '@/lib/games/chess/checkingHelpers';
import { isStalemate, hasInsufficientMatingMaterial, getBoardState } from '@/lib/games/chess/drawHelpers';
import { Piece, Pawn, Rook, King } from '@/lib/games/chess/pieces';
import { bus } from '../../../main';

export default Vue.extend({
	name : 'Board',

	components : {
		Square,
	},

	props : {
		isNewGame : {
			type    : Boolean,
			default : true,
		},

		isWhite : {
			type    : Boolean,
			default : true,
		},
	},

	data : function() {
		return {
			boardSize           : 8,
			boardStates         : {} as {[index: string]: number},
			moveCounter         : 0,
			gameStates          : [],
			occupiedSquares     : [] as (Piece | null)[][],
			possibleMoveSquares : [] as boolean[][],
			allPieces           : {} as {[index: string]: Piece[]},
			isInitialized       : false,
			selectedPiece       : null as Piece | null,
			isWhiteToMove       : true,
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
			return this.isWhiteToMove ? 'white': 'black';
		},
	},

	watch : {
		isNewGame : function(): void {
			if (this.isNewGame) {
				this.initializeGame();
				this.$emit('game-started');
			}
		},
	},

	mounted() {
		this.initializeGame();
		bus.$on('promotion', (pieceType: PieceAbbreviation) => {
			this.promotePawn(pieceType);
		});
	},

	methods : {
		setEmptyStates(): void {
			this.occupiedSquares = [];
			this.possibleMoveSquares = [];

			for (let i = 0; i < this.boardSize; i++) {
				this.occupiedSquares.push(new Array(this.boardSize).fill(null));
				this.possibleMoveSquares.push(new Array(this.boardSize).fill(false));
			}
			for (const pieceType of pieceTypes) {
				this.allPieces[pieceType] = [];
			}
		},

		initializeGame(): void {
			this.setEmptyStates();
			this.isWhiteToMove = true;
			this.selectedPiece = null;
			this.moveCounter = 0;
			this.boardStates = {};
			this.gameStates = [];

			const { allPieces, occupiedSquares } = initializeBoard(pieceStartingPositions);

			this.allPieces = allPieces;
			this.occupiedSquares = occupiedSquares;
			this.trackBoardState();

			this.isInitialized = true;
		},

		handleSquareClick({ square, rank, file }: SquareClickedEvent): void {
			const checkingPieces = getCheckingPieces(this.allPieces, this.occupiedSquares, this.colorToMoveNext);

			if (checkingPieces.length > 0) {
				if (this.selectedPiece !== null && this.possibleMoveSquares[rank - 1][file - 1]) {
					this.movePiece({ piece : this.selectedPiece, rank, file });
					this.resetMoveSquares();

					return;
				}

				this.resetMoveSquares();

				if (square === null || this.selectedPiece === square || this.colorToMoveNext !== square.color) {
					this.selectedPiece = null;
					return;
				}

				const legalMoves = getLegalMoves({
					allPieces       : this.allPieces,
					checkingPieces,
					clickedPiece    : square,
					colorToMoveNext : this.colorToMoveNext,
					occupiedSquares : this.occupiedSquares,
				});

				this.setMoveSquares(legalMoves);
				this.selectedPiece = square;
				return;
			}

			if (this.selectedPiece !== null && this.possibleMoveSquares[rank - 1][file - 1]) {
				this.movePiece({ piece : this.selectedPiece, rank, file });
				return;
			}
			this.resetMoveSquares();

			if (square === null || this.selectedPiece === square || this.colorToMoveNext !== square.color) {
				this.selectedPiece = null;
				return;
			}

			const moves: number[][] = square.moves({
				occupiedSquares : this.occupiedSquares,
				allPieces       : this.allPieces,
			});

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

			if (piece instanceof Pawn) {
				this.moveCounter = 0;

				if (rank === 8 || rank === 1) {
					this.$emit('pawn-reach-end');
				}

				// HACK: Change this once board states are kept track of
				if (Math.abs(piece.rank - rank) === 2) {
					piece.canBeCapturedByEnPassant = true;
				}
			} else {
				this.moveCounter++;
			}

			if (piece instanceof King) {
				const colorRook = `${piece.color[0]}R`;

				if (file - piece.file === -2) {
					this.castleQueenside(rank, colorRook);
				}

				if (file - piece.file === 2) {
					this.castleKingside(rank, colorRook);
				}
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

			if (piece instanceof Pawn) {
				const adjacentSquareRank = this.isWhiteToMove ? rank - 2 : rank;
				const adjacentSquareContents: Piece | null = this.occupiedSquares[adjacentSquareRank][file - 1];
				if (adjacentSquareContents instanceof Pawn && adjacentSquareContents.canBeCapturedByEnPassant) {
					this.capturePieceByEnPassant(adjacentSquareContents);
				}
			}

			if (piece instanceof Pawn && (rank === 8 || rank === 1)) {
				this.$emit('pawn-reach-end');
				return;
			}

			const newPieceRow: (Piece | null)[] = this.occupiedSquares[rank - 1].slice(0);
			newPieceRow[file - 1] = piece;
			this.$set(this.occupiedSquares, rank - 1, newPieceRow);

			this.completeTurn();
		},

		castleQueenside(rank: number, colorRook: string): void {
			const queensideRook = this.allPieces[colorRook][findPieceIndex(this.allPieces, colorRook, 0)];

			if (queensideRook instanceof Rook) {
				const newPieceRow: (Piece | null)[] = this.occupiedSquares[rank - 1].slice(0);
				newPieceRow[queensideRook.file - 1] = null;
				queensideRook.file += 3;
				newPieceRow[queensideRook.file - 1] = queensideRook;
				this.$set(this.occupiedSquares, rank - 1, newPieceRow);
				queensideRook.hasMoved = true; // Don't really have to do this since king has already moved
			}
		},

		castleKingside(rank: number, colorRook: string): void {
			const kingsideRook = this.allPieces[colorRook][findPieceIndex(this.allPieces, colorRook, 1)];

			if (kingsideRook instanceof Rook) {
				const newPieceRow: (Piece | null)[] = this.occupiedSquares[rank - 1].slice(0);
				newPieceRow[kingsideRook.file - 1] = null;
				kingsideRook.file -= 2;
				newPieceRow[kingsideRook.file - 1] = kingsideRook;
				this.$set(this.occupiedSquares, rank - 1, newPieceRow);
				kingsideRook.hasMoved = true; // Don't really have to do this since king has already moved
			}
		},

		capturePiece(piece: Piece): void {
			const pieceType = `${piece.color[0]}${piece.abbreviation}`;
			const pieceIndexToCapture = this.allPieces[pieceType].findIndex((p: Piece) => Number(p.id) === Number(piece.id));
			this.allPieces[pieceType].splice(pieceIndexToCapture, 1);
			this.moveCounter = 0;
		},

		capturePieceByEnPassant(piece: Piece): void {
			this.capturePiece(piece);
			const newPieceRow: (Piece | null)[] = this.occupiedSquares[piece.rank - 1].slice(0);
			newPieceRow[piece.file - 1] = null;
			this.$set(this.occupiedSquares, piece.rank - 1, newPieceRow);
		},

		promotePawn(pieceAbbreviation: PieceAbbreviation): void {
			const { rank, file } = findPawnToPromoteLocation(this.allPieces, this.colorToMoveNext);
			const promotionPiece =  getPromotionPiece(this.allPieces, {
				color        : this.colorToMoveNext,
				file         : file,
				rank         : rank,
				abbreviation : pieceAbbreviation,
			});

			const newPieceRow: (Piece | null)[] = this.occupiedSquares[rank - 1].slice(0);
			newPieceRow[file - 1] = promotionPiece;
			this.$set(this.occupiedSquares, rank - 1, newPieceRow);

			const oldPieceType = `${this.colorToMoveNext[0]}P`;
			const pieceIndexToCapture = this.allPieces[oldPieceType].findIndex((p: Piece) => Number(p.rank) === Number(rank) &&  Number(p.file) === Number(file));
			this.allPieces[oldPieceType].splice(pieceIndexToCapture, 1);

			const newPieceType = `${this.colorToMoveNext[0]}${pieceAbbreviation}`;
			this.allPieces[newPieceType].push(promotionPiece);

			this.completeTurn();
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

		completeTurn(): void {
			this.trackBoardState();

			this.selectedPiece = null;
			this.resetMoveSquares();

			this.setNextPlayerTurn();
		},

		setNextPlayerTurn(): void {
			this.resetEnPassant();
			this.isWhiteToMove = !this.isWhiteToMove;
			this.checkIfCheckmate();
			this.checkIfDraw();
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

		checkIfCheckmate(): void {
			if (isCheckmate({
				allPieces       : this.allPieces,
				colorToMoveNext : this.colorToMoveNext,
				occupiedSquares : this.occupiedSquares,
			})) {
				const result = this.isWhiteToMove
					? '0 - 1 Black Wins!'
					: '1 - 0 White Wins!';
				this.$emit('game-over', result);
			}
		},

		checkIfDraw(): void {
			this.checkIfStalemate();
			this.checkIfInsufficeintMaterial();
			this.checkRepetition();
			this.check50Moves();
		},

		checkIfStalemate(): void {
			if (isStalemate(this.allPieces, this.occupiedSquares, this.colorToMoveNext)) {
				const result = '1/2 - 1/2 Draw by stalemate!';
				this.$emit('game-over', result);
			}
		},

		checkIfInsufficeintMaterial(): void {
			if (hasInsufficientMatingMaterial(this.allPieces)) {
				const result = '1/2 - 1/2 Draw by insufficient material!';
				this.$emit('game-over', result);
			}
		},
		
		check50Moves(): void {
			// It's easier to just track each side's moves and check twice the amount
			if (this.moveCounter >= 100) {
				const result = '1/2 - 1/2 Draw by fifty-move rule';
				this.$emit('game-over', result);
			}
		},

		checkRepetition(): void {
			for (const boardState in this.boardStates) {
				if (this.boardStates[boardState] >= 3) {
					const result = '1/2 - 1/2 Draw by repetition';
					this.$emit('game-over', result);
				}
			}
		},

		trackBoardState(): void {
			const newBoardState = getBoardState(this.occupiedSquares);

			if (this.boardStates[newBoardState]) {
				this.boardStates[newBoardState]++;
			} else {
				this.boardStates[newBoardState] = 1;
			}
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
