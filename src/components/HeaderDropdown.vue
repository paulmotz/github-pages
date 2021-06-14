<template lang='pug'>
	label.dropdown-top(tabindex="0") {{ dropdownLabel }}
		.dropdown-content
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

.dropdown-item
	padding: 0 0.5rem

.dropdown-top:hover .dropdown-content, .dropdown-item
	display: block
</style>
