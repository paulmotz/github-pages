<template lang='pug'>
	.validated-input
		slot
		.error-message {{ errorMessage }}
</template>

<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
	name : 'ValidatedInput',

	props : {
		errorMessage : {
			type    : String,
			default : '',
		},
		shouldShowError : Boolean,
	},
});
</script>

<style lang='stylus'>
@import '../assets/colors.styl'

.error-message
	color: red
	font-size: 0.75rem
	line-height: 1rem
	height: 1rem
	margin-left: 0.25rem
</style>
