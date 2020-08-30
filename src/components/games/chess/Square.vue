<template lang='pug'>
	.square(
		v-bind:class="classObject"
		v-on:click="clickPiece")
		.hollow-circle
		font-awesome-icon.fa-icon(
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
				'has-piece'    : this.piece !== null,
			};
		},
	},


	methods : {
		clickPiece(): void {
			this.$emit('square-clicked', {
				square : this.piece,
				rank   : this.rankIndex,
				file   : this.fileIndex,
			});
		},
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='stylus'>
@import '../../../assets/variables.styl'
.sqaure
	display: flex
	justify-content: center
	align-content: center
	padding: 10%

.dark-square
	background-color: $board-dark-square

.light-square
	background-color: $board-light-square

.hollow-circle
	margin: 10%
	width: 80%
	height: 80%
	background-color: transparent
	border-radius: 50%
	box-sizing: border-box

.highlighted .hollow-circle
	border: black 1px solid

.highlighted .hollow-circle:hover
	border: black 3px solid

.has-piece, .highlighted
	cursor: pointer

.fa-icon
	position: relative
	top: -40px
</style>

