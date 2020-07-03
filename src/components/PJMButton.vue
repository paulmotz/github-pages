<template lang='pug'>
	button(
		v-bind:disabled="isDisabled"
		v-on:click="emitClicked"
		) {{ buttonText }}
</template>

<script>
export default {
	name: 'PJMButton',

	props : {
		isDisabled: Boolean,
		loadingText: String,
		text: String
	},

	computed : {
		buttonText() {
			return this.isDisabled ? this.loadingText : this.text
		}
	},

	methods : {
		emitClicked() {
			this.$emit('clicked');
		},
	}
}
</script>

<style lang='stylus'>
button
	background-color: blue
	border: none
	border-radius: 5px
	color: white
	padding: 10px

button:hover
	background-color: green

button:disabled
	background-color: cyan
	color: black
</style>
