<template lang='pug'>
	.square(v-bind:class="{'dark-square' : !isLightSquare, 'light-square' : isLightSquare }")
		font-awesome-icon(
			v-if="iconName !== ''"
			v-bind:icon="iconName")
</template>

<script>
import Vue from 'vue';
import { Piece } from '@/lib/games/chess/pieces/piece';

export default Vue.extend({
	name : 'Square',
	
	props : {
		fileIndex : Number,
		rankIndex : Number,
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
		iconName() {
			console.log(this.piece);
			return this.piece && this.piece.iconName ? this.piece.iconName : '';
		},

		isLightSquare() {
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

