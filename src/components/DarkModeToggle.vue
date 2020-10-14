<template lang='pug'>
	.dark-mode-toggle
		font-awesome-icon.fa-icon(
			v-bind:icon="'sun'")
		toggle-checkbox
		font-awesome-icon.fa-icon(
			v-bind:icon="'moon'")
</template>

<script lang='ts'>
import Vue from 'vue';
import ToggleCheckbox from '@/components/ToggleCheckbox.vue';

export default Vue.extend({
	name : 'DarkModeToggle',

	components : {
		ToggleCheckbox,
	},
});
</script>

<style scoped lang='stylus'>
@import '../assets/variables.styl'
.fa-icon
	color: $white
</style>