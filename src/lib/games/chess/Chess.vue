<template lang='pug'>
	.chess
		h1 Chess
		Board
</template>

<script>
import Vue from 'vue';
import Board from '@/components/games/chess/Board.vue';

export default Vue.extend({
	name : 'Chess',
	
	components : {
		Board,
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
</style>
