<template lang='pug'>
	.dark-mode-toggle
		font-awesome-icon.fa-icon(icon="sun")
		toggle-checkbox(v-model="isDarkModeEnabled")
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
			isDarkModeEnabled : false,
		};
	},
});
</script>

<style scoped lang='stylus'>
@import '../assets/variables.styl'
.dark-mode-toggle
	display: flex

.fa-icon
	color: $white
	margin: 0 0.1875rem
</style>