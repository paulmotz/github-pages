<template lang='pug'>
	.square(
		v-bind:class="classObject"
		v-on:click="clickPiece")
		.hollow-circle
		//- font-awesome-icon.fa-icon(
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
.sqaure
	display: flex
	justify-content: center
	align-content: center
	padding: 10%

.dark-square
	background-color: $board-dark-square

.light-square
	background-color: $board-light-square

.highlighted
	background-color: blue

.hollow-circle::after
	// display: inline-block
	
	// display: inline-block
	// width: 50px
	// height: 50px
	// border-radius: 50%
	// border-style: solid
	// border-width: 2px
	// border-color: blue
	// background-color: rgba(0, 0, 0, 0)
	// position: absolute
	// top:0
	// left:0
	// pointer-events:none

	// position: relative
	// left: 0
	// top: 0
	// width: 30px;
	// height: 30px;
	width: 80%
	height: 80%
	background-color: transparent
	border-radius: 50%
	// display: inline-flex
	// margin: auto auto

	/* Use this */
	border-color: black
	border-width: 1px
	border-style: solid

.fa-icon
	position: absolute
	// top: 10px
	// left: 10px
	z-index: 2
</style>

