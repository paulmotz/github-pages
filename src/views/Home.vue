<template lang='pug'>
	.home-wrapper
		h1 Paul Motz
		.photo-wrapper
			img.photo(src="../assets/me.jpg")
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
		p For fun, I love playing guitar, listening to music, going for a run or a bike ride, playing board games and collecting LEGO.
</template>

<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
	name : 'Home',
});
</script>

<style scoped lang='stylus'>
@import '../assets/colors.styl'
.home-wrapper
	margin: 3rem 6rem
	font-size: 1.25rem

	h1
		text-align center

	.photo-wrapper
		margin: 0 auto 30px
		position: relative
		width: 200px
		height: 200px
		overflow: hidden
		border-radius: 50%
		border: 2px solid $white

		.photo
			width: auto
			height: 100%
			margin-left: -50px

	.photo-wrapper
		border: 2px solid $black

	p
		margin: 0 0 1rem 0

		a
			color: $blue-600
			text-decoration: none

			&:hover
				text-decoration: underline

			&:visited
				color: $blue-800

[data-theme='dark'] .home-wrapper
	.photo-wrapper
		border: 2px solid $white
</style>
