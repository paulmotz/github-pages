<template lang='pug'>
	.chess
		h1
			font-awesome-icon.fa-icon(icon="chess-pawn")
			span Chess
		Board(
			v-bind:isNewGame="isNewGame"
			v-on:game-over="showResult"
			v-on:game-started="startGame"
			v-on:pawn-reach-end="openModal")
		h3.result {{result}}
		PJMButton(
			text="New Game"
			v-on:clicked="buttonClicked")
		PJMModal(v-show="shouldShowModal")
			template(v-slot:header) Select a Piece for promotion
			template(v-slot:body)
				.icon-row
					.icon-wrapper(v-on:click="pieceClicked('Q')")
						font-awesome-icon.fa-icon(
							icon="chess-queen")
					.icon-wrapper(v-on:click="pieceClicked('R')")
						font-awesome-icon.fa-icon(
							icon="chess-rook")
				.icon-row
					.icon-wrapper(v-on:click="pieceClicked('B')")
						font-awesome-icon.fa-icon(
							icon="chess-bishop")
					.icon-wrapper(v-on:click="pieceClicked('N')")
						font-awesome-icon.fa-icon(
							icon="chess-knight")
</template>

<script lang='ts'>
import Vue from 'vue';
import Board from '@/components/games/chess/Board.vue';
import PJMButton from '@/components/PJMButton.vue';
import PJMModal from '@/components/PJMModal.vue';
import { bus } from '../../../main';

export default Vue.extend({
	name : 'Chess',
	
	components : {
		Board,
		PJMButton,
		PJMModal,
	},

	data : function() {
		return {
			isNewGame       : false,
			result          : '',
			shouldShowModal : false,
		};
	},

	methods : {
		buttonClicked(): void {
			this.isNewGame = true;
			// this.openModal();
		},

		closeModal(): void {
			this.shouldShowModal = false;
		},

		openModal(): void {
			this.shouldShowModal = true;
		},

		pieceClicked(pieceName: string): void {
			bus.$emit('promotion', pieceName);
			this.closeModal();
		},

		showResult(result: string): void {
			this.result = result;
		},

		startGame(): void {
			this.result = '';
			this.isNewGame = false;
		},
	},
});
</script>

<style scoped lang='stylus'>
@import '../../../assets/colors.styl'

.chess
	height: 100%
	display: flex
	align-items: center
	justify-content: center
	text-align: center
	flex-direction: column
	color: $text--theme-light

[data-theme='dark'] .chess
	color: $text--theme-dark

.result
	font-size: 1rem
	height: 1rem
	line-height: 1rem

.icon-row
	display: flex
	flex-direction: row

.icon-wrapper
	cursor: pointer
	width: 50%
	display: flex
	align-items: center
	justify-content: center
	padding: 0.5rem

.icon-wrapper:hover
	background-color: rgba(49, 72, 95, 0.3)

.fa-icon
	height: 2rem
	width: 2rem
	opacity: 1

</style>
