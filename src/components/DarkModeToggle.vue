<template lang='pug'>
	.dark-mode-toggle(
		v-on:click="handleDarkModeToggle"
		v-on:dblclick="handleDarkModeDoubleClick"
		v-on:keyup.enter="handleDarkModeToggle"
		tabindex="0")
		font-awesome-icon.fa-icon(
			v-show="isDarkModeEnabled"
			icon="sun")
		font-awesome-icon.fa-icon(
			v-show="!isDarkModeEnabled"
			icon="moon")
</template>

<script lang='ts'>
import Vue from 'vue';
import ToggleCheckbox from '@/components/ToggleCheckbox.vue';

export default Vue.extend({
	name : 'DarkModeToggle',

	components : {
		ToggleCheckbox,
	},

	data : function() {
		return {
			isDarkModeEnabled       : false,
			hasReadFromLocalStorage : false,
		};
	},

	mounted(): void {
		const systemTheme: string = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		const preferredTheme: string = localStorage.getItem('preferredTheme') || systemTheme;

		document.body.setAttribute('data-theme', preferredTheme);
		this.isDarkModeEnabled = preferredTheme === 'dark';
	},

	methods : {
		handleDarkModeToggle(): void {
			this.isDarkModeEnabled = !this.isDarkModeEnabled;
			if (this.isDarkModeEnabled) {
				document.body.setAttribute('data-theme', 'dark');
				localStorage.setItem('preferredTheme', 'dark');
			} else {
				document.body.setAttribute('data-theme', 'light');
				localStorage.setItem('preferredTheme', 'light');
			}
		},

		handleDarkModeDoubleClick(): void {
			if (window.getSelection && window.getSelection() !== null) {
				window.getSelection().removeAllRanges();
			}
			else if (document.selection) {
				document.selection.empty();
			}
		},
	},
});
</script>

<style scoped lang='stylus'>
@import '../assets/colors.styl'
.dark-mode-toggle
	height: 100%
	display: flex
	align-items: center
	padding: 0 0.5rem
	cursor: pointer

.dark-mode-toggle:hover
	background-color: $gray-800

.fa-icon
	color: $white
</style>