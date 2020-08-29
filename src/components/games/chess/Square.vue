<template lang='pug'>
	.square(v-bind:class="{'dark-square' : !isLightSquare, 'light-square' : isLightSquare }")
		font-awesome-icon(
			v-if="iconName !== ''"
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
	},

	computed : {
		iconName(): string {
			return this.piece && this.piece.iconName ? this.piece.iconName : '';
		},

		isLightSquare(): boolean {
			return ( this.fileIndex + this.rankIndex ) % 2 === (this.isWhiteDown ? 1 : 0);
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
</style>

