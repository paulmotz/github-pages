<template lang='pug'>
	label.dropdown-top(
		tabindex="0"
		v-bind:class="{ 'clicked' : this.clicked }"
		v-on:click="toggleClicked") {{ dropdownLabel }}
		.dropdown-content(v-on:clicked="toggleClicked")
			slot
</template>

<script lang='ts'>
import Vue from 'vue';
export default Vue.extend({
	name : 'Header',

	props : {
		dropdownLabel : {
			type    : String,
			default : '',
		},
	},

	data : function() {
		return {
			clicked : false,
		};
	},

	methods : {
		toggleClicked(): void {
			console.log(123);
			this.clicked = !this.clicked;
		},
	},
});
</script>

<style scoped lang='stylus'>
@import '../assets/colors.styl'
.dropdown-content
	display: none
	position: absolute
	top: 51px
	margin-left: -0.5rem
	background-color: $header-footer-background-color
	opacity: 0.85

.dropdown-item
	padding: 0 0.5rem

.dropdown-top:hover .dropdown-content, .dropdown-item
	display: block
</style>
