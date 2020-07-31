<template lang='pug'>
	div#app
		LastFM
</template>

<script lang='ts'>
import Vue from 'vue';
import LastFM from './components/LastFM/LastFM.vue';

export default Vue.extend({
	name : 'App',
	
	components : {
		LastFM,
	},
});
</script>

<style lang='stylus'>
@import './assets/variables.styl'

#app
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	// text-align: center;
	color: $text-color;
	margin-top: 40px;
	display: flex
	align-items: center
	justify-content: center
</style>
