<template lang='pug'>
	input.toggle-checkbox(type="checkbox")
</template>

<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
	name : 'ToggleCheckbox',
});
</script>

<style scoped lang='stylus'>
@import '../assets/variables.styl'
.toggle-checkbox
	height: 0;
	width: 0;
	visibility: hidden;
</style>