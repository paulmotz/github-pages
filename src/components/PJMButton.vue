<template lang='pug'>
	button(
		v-bind:disabled="isDisabled"
		v-on:click="emitClicked"
		) {{ buttonText }}
</template>

<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
	name : 'PJMButton',

	props : {
		isDisabled  : Boolean,
		loadingText : {
			type    : String,
			default : '',
		},
		text : {
			type    : String,
			default : '',
		},
	},

	computed : {
		buttonText(): string {
			return this.isDisabled && this.loadingText ? this.loadingText : this.text;
		},
	},

	methods : {
		emitClicked(): void {
			this.$emit('clicked');
		},
	},
});
</script>

<style lang='stylus'>
@import '../assets/variables.styl'

button
	background-color: $button-background-color
	border: none
	border-radius: 5px
	color: white
	padding: 10px
	cursor: pointer

button:hover
	background-color: $button-background-color-hover

button:disabled
	background-color: $button-background-color-disabled
	// color: black
	cursor: not-allowed
	opacity: 0.7
</style>
