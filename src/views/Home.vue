<template lang='pug'>
	.home-wrapper
		p Welcome to my personal website!
		p 
			| This is my playground to build things with technologies that interest me. 
			a(href="https://vuejs.org/") Vue.js
			|  is the backbone (pun intended) of this site. This site uses several components of the Vue ecosystem including 
			a(href="https://cli.vuejs.org/") Vue CLI
			|  and 
			a(href="https://router.vuejs.org/") Vue Router
			| .
			| Outside of Vue, this site also uses 
			a(href="https://www.typescriptlang.org/") TypeScript
			| , 
			a(href="https://pugjs.org/api/getting-started.html") pug
			| , 
			a(href="https://stylus-lang.com/") stylus
			|  and 
			a(href="https://stylus-lang.com/") Jest
			|  (❤️).
		p I am using these technologies to build games, visualizations and track how I listen to music.
</template>

<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
	name : 'Home',
});
</script>

<style scoped lang='stylus'>
.home-wrapper
	margin: 5rem
	font-size: 1.25rem

	p
		margin: 0 0 1rem 0
</style>
