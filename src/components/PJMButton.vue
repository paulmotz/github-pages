<template lang='pug'>
	button(
		v-bind:disabled="isDisabled"
		v-on:click="emitClicked"
		) {{ buttonText }}
		slot
</template>

<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
	name : 'PJMButton',

	props : {
		isDisabled : {
			type    : Boolean,
			default : false,
		},
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

<style scoped lang='stylus'>
@import '../assets/variables.styl'

button
	background-color: $button-background-color
	border: none
	border-radius: 5px
	color: white
	padding: 10px
	cursor: pointer
	font-weight: 600

button:hover
	background-color: $button-background-color-hover

button:disabled
	background-color: $button-background-color-disabled
	// color: black
	cursor: not-allowed
	opacity: 0.7
</style>
