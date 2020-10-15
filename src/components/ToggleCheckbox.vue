<template lang='pug'>
	.toggle(
		v-bind:class="{ 'checked' : this.value }"
		v-on:click="toggleValue")
		input.toggle-checkbox(type="checkbox")
		.switch
</template>

<script lang='ts'>
import Vue from 'vue';
import { bus } from '../main';

export default Vue.extend({
	name : 'ToggleCheckbox',

	props : {
		value : {
			type    : Boolean,
			default : false,
		},
	},

	methods : {
		toggleValue(): void {
			this.$emit('input', !this.value);
			bus.$emit('darkThemeToggled', !this.value);
		},
	},
});
</script>

<style scoped lang='stylus'>
@import '../assets/variables.styl'
.toggle
	height: 1rem
	width: 2rem
	border-radius: 0.5rem
	display: flex
	cursor: pointer
	align-items: center
	background: $inactive-toggle-color

.toggle.checked
	background: $active-toggle-color

.toggle-checkbox
	height: 0
	width: 0
	opacity: 0
	position: absolute

.switch
	height: 0.875rem
	width: 0.875rem
	background: white
	border-radius: 50%
	transform: translateX(0)

.checked .switch
	transform: translateX(1rem)
</style>