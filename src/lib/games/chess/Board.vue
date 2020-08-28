<template lang='pug'>
	.board
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

<script>
import Vue from 'vue';
import Square from '@/components/games/chess/Square.vue';
import { occupiedSquares, pieceStartingPositions } from '../../../lib/chess';

export default Vue.extend({
	name : 'Board',

	components : {
		Square,
	},

	computed : {
		files() {
			return this.isWhite
				? [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ]
				: [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ].reverse();
		},

		ranks() {
			return this.isWhite
				? [ 1, 2, 3, 4, 5, 6, 7, 8 ].reverse()
				: [ 1, 2, 3, 4, 5, 6, 7, 8 ];
		},
	},

	data : function() {
		return {
			occupiedSquares : occupiedSquares,

			pieces : pieceStartingPositions,
		};
	},

	props : {
		isWhite : {
			type    : Boolean,
			default : true,
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
</style>

