<template lang='pug'>
	.square(
		v-bind:class="classObject"
		v-on:click="clickPiece")
		font-awesome-icon(
			v-if="iconName !== ''"
			v-bind:color="pieceColor"
			v-bind:icon="iconName")
</template>

<script lang='ts'>
import Vue from 'vue';
import { Piece } from '@/lib/games/chess/pieces';

export default Vue.extend({
	name : 'Square',
	
	props : {
		fileIndex : {
			type    : Number,
			default : 0,
		},
		rankIndex : {
			type    : Number,
			default : 0,
		},
		isClicked : {
			type    : Boolean,
			default : false,
		},
		isWhiteDown : Boolean,
		piece       : {
			type    : Piece,
			default : null,
		},
		isHighlighted : {
			type    : Boolean,
			default : true,
		},
	},

	computed : {
		iconName(): string {
			return this.piece && this.piece.iconName ? this.piece.iconName : '';
		},

		pieceColor(): string {
			return this.piece && this.piece.color ? this.piece.color : '';
		},

		isLightSquare(): boolean {
			return ( this.fileIndex + this.rankIndex ) % 2 === (this.isWhiteDown ? 1 : 0);
		},

		classObject(): Record<string, boolean> {
			return {
				'dark-square'  : !this.isLightSquare,
				'light-square' : this.isLightSquare,
				'highlighted'  : this.isHighlighted,
			};
		},
	},


	methods : {
		clickPiece(): void {
			this.$emit('square-clicked', this.piece);
		},
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='stylus'>
@import '../../../assets/variables.styl'

.dark-square
	background-color: $board-dark-square

.light-square
	background-color: $board-light-square

.highlighted
	background-color: blue
</style>

