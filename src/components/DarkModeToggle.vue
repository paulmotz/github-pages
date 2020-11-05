<template lang='pug'>
	.dark-mode-toggle
		font-awesome-icon.fa-icon(icon="sun")
		toggle-checkbox(
			v-bind:value="isDarkModeEnabled"
			v-on:input="handleDarkModeToggle")
		font-awesome-icon.fa-icon(icon="moon")
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
		handleDarkModeToggle(isDarkModeEnabled: boolean): void {
			this.isDarkModeEnabled = isDarkModeEnabled;
			if (isDarkModeEnabled) {
				document.body.setAttribute('data-theme', 'dark');
				localStorage.setItem('preferredTheme', 'dark');
			} else {
				document.body.setAttribute('data-theme', 'light');
				localStorage.setItem('preferredTheme', 'light');
			}
		},
	},
});
</script>

<style scoped lang='stylus'>
@import '../assets/variables.styl'
.dark-mode-toggle
	display: flex

.dark-mode-toggle:focus
	color: red

.fa-icon
	color: $white
	margin: 0 0.1875rem
</style>