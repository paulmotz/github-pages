<template lang='pug'>
	#app
		Header
		.router-view-wrapper
			router-view
</template>

<script lang='ts'>
import Vue from 'vue';
import Header from '@/components/Header.vue';

export default Vue.extend({
	name       : 'App',
	components : {
		Header,
	},
});
</script>

<style lang='stylus'>
@import './assets/variables.styl'
html, body
	margin: 0
	height: 100%

#app
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	// text-align: center;
	color: $text-color;
	display: flex
	flex-direction: column
	height: 100%

.router-view-wrapper
	height: 100%
	margin-top: 50px
	width: 100%
	background: $background-light

[data-theme='dark'] .router-view-wrapper
	background: $background--theme-dark
</style>
