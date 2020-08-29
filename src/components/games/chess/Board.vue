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
				v-bind:piece="occupiedSquares[isWhite ? 7 - rankIndex : rankIndex][isWhite ? fileIndex : 7 - fileIndex]")
			.border-cell {{ rank }}
		.border-row
			.border-cell
			.border-cell(v-for="(file, fileIndex) in files") {{ file }}
			.border-cell
</template>

<script lang="ts">
import Vue from 'vue';
import Square from '@/components/games/chess/Square.vue';
import { pieceColors, allPieceTypes } from '@/lib/types';
import { getPieceColor, getPieceName, pieceStartingPositions } from '@/lib/games/chess/helpers';
import { pieceConstructors } from '@/lib/games/chess/setupHelpers';

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
			pieces        : pieceStartingPositions,
			isInitialized : false,
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
					const [ file, rank ]: number[] = pieceStartingPositions[piece][pieceStartingPositionIndex];

					const newPiece: allPieceTypes = new pieceConstructors[pieceName]({ color, abbreviation, file, rank, id : pieceStartingPositionIndex});

					// allPieces[piece].push(newPiece);
					this.occupiedSquares[rank - 1][file - 1] = newPiece;
				}
			}
			this.isInitialized = true;
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

