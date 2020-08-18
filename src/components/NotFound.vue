<template lang='pug'>
	.not-found
		h1 This is (probably) not the page you are looking for.
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
	name : 'NotFound',
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='stylus'>

.not-found
	height: 100%
	display: flex
	align-items: center
	justify-content: center
	text-align: center
</style>
