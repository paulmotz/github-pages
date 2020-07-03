<template lang='pug'>
	button(v-on:click="setIsDisabled")
</template>

<script>
export default {
	name: 'Hello',

	props : [ 'disabled' ],

	methods : {
		setIsDisabled() {
			console.log(123);
		}
	}
}
</script>

<style lang='stylus'>

</style>
