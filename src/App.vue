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
	name : 'App',

	components : {
		Header,
	},
});
</script>

<style lang='stylus'>
@import './assets/colors.styl'
html, body
	margin: 0
	height: 100%
	display: flex
	flex-direction: column

#app
	font-family: Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: $text-color-theme-light;
	display: flex
	flex-direction: column
	flex-grow: 1

[data-theme='dark'] #app
	color: $text-color--theme-dark

.router-view-wrapper
	height: 100%
	margin-top: 50px
	width: 100%
	background: $background-color--theme-light

[data-theme='dark'] .router-view-wrapper
	background: $background-color--theme-dark
</style>
