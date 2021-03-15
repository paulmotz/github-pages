<template lang='pug'>
	nav.header
		PJMButton.hamburger-button(
			v-bind:class="{ 'clicked' : this.clicked }"
			v-on:clicked="toggleClicked")
			span
			span
			span
		DarkModeToggle
		.links
			router-link.header-link(to="/") Home
			label.dropdown-top Games
				.dropdown-content
					router-link.dropdown-item(to="/chess") Chess
			label.dropdown-top Visualizations
				.dropdown-content
					router-link.dropdown-item(to="/provincial-covid") Provincial COVID-19
					router-link.dropdown-item(to="/state-covid") States COVID-19
			router-link.header-link(to="/lastfm") last.fm
</template>

<script lang='ts'>
import Vue from 'vue';
import DarkModeToggle from '@/components/DarkModeToggle.vue';
import PJMButton from '@/components/PJMButton.vue';

export default Vue.extend({
	name : 'Header',

	components : {
		DarkModeToggle,
		PJMButton,
	},

	data : function() {
		return {
			clicked : false,
		};
	},

	methods : {
		toggleClicked(): void {
			this.clicked = !this.clicked;
		},
	},
});
</script>

<style scoped lang='stylus'>
@import '../assets/variables.styl'
.header
	display: flex
	align-items: center
	justify-content : center
	height: 50px
	width: 100%
	background-color: $header-footer-background-color
	position: fixed
	top: 0
	z-index: 1
	border-bottom: 1px solid $vue-green

.header-link, .dropdown-top, .dropdown-item
	color: $router-link-color
	font-weight: 600
	height: 100%
	text-decoration: none

.links
	.header-link:hover, .dropdown-top:hover
		background-color: $darker-vue-blue

a:hover
	background-color: $darker-vue-blue

a.router-link-exact-active
	color: $active-router-link-color

.dropdown-content
	display: none
	position: absolute
	top: 51px
	margin-left: -0.5rem
	background-color: $header-footer-background-color

.dropdown-item
	padding: 0 0.5rem

.dropdown-top:hover .dropdown-content, .dropdown-item
	display: block

.header-link, .dropdown-top
	display: inline-block
	line-height: 50px
	padding: 0 0.5rem

.hamburger-button
	display: none
	background: none
	margin: 0

	span
		height: 4px
		width: 20px
		background: white
		margin: 1px 0
		border-radius: 2px
		position: relative
		display: block

	span:nth-of-type(1), span:nth-of-type(3)
		transition-duration: 0.3s

.hamburger-button, .hamburger-button:hover
	background: none

.hamburger-button.clicked span:nth-of-type(1)
	transform: rotate(45deg)
	top: 5px
	transition-duration: 0.3s

.hamburger-button.clicked span:nth-of-type(2)
	visibility: hidden

.hamburger-button.clicked span:nth-of-type(3)
	transform: rotate(-45deg)
	top: -5px
	transition-duration: 0.3s

@media only screen and (max-width: 600px)
	.hamburger-button
		display: block

	.header
		justify-content: space-between

	.links
		display: none

</style>
