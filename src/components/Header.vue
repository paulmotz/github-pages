<template lang='pug'>
	nav.header
		.links
			router-link.header-link(to="/") Home
			label.dropdown-top.visualizations {{'Visualizations'}}
				.dropdown-content
					router-link.dropdown-item(to="/about") Provincial COVID-19
					router-link.dropdown-item(to="/about") States COVID-19
			router-link.header-link(to="/lastfm") last.fm
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name : 'Header',

  props : {
	msg : String,
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

.links, a
	color: $router-link-color
	font-weight: 600
	height: 100%
	text-decoration: none

links:hover, .visualizations:hover
	text-decoration: underline

a:hover
	text-decoration: underline

a.router-link-exact-active
	color: $active-router-link-color

.dropdown-content
	display: none
	position: absolute
	top: 50px
	margin-left: -0.5rem
	padding: 0 0.5rem
	background-color: $header-footer-background-color

.dropdown-top:hover .dropdown-content, .dropdown-item
	display: block

.header-link, .dropdown-top
	display: inline-block
	line-height: 50px
	margin: 0 0.5rem

</style>
