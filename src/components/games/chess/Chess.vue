<template lang='pug'>
	.chess
		h1 Chess
		Board(
			v-bind:isNewGame="isNewGame"
			v-on:game-over="showResult"
			v-on:game-started="startGame")
		h3.result {{result}}
		PJMButton(
			v-bind:text="'New Game'"
			v-on:clicked="buttonClicked")
</template>

<script lang='ts'>
import Vue from 'vue';
import Board from '@/components/games/chess/Board.vue';
import PJMButton from '@/components/PJMButton.vue';

export default Vue.extend({
	name : 'Chess',
	
	components : {
		Board,
		PJMButton,
	},

	data : function() {
		return {
			isNewGame : false,
			result    : '',
		};
	},

	methods : {
		buttonClicked(): void {
			this.isNewGame = true;
		},

		showResult(result: string): void {
			this.result = result;
		},

		startGame(): void {
			this.isNewGame = false;
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
	justify-content: center
	text-align: center
	flex-direction: column

.result
	font-size: 1rem
	height: 1rem
	line-height: 1rem
</style>
