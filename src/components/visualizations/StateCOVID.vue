<template lang='pug'>
	.state-covid
		h1 USA
</template>

<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
	name : 'StateCOVID',
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='stylus'>
@import '../../assets/variables.styl'

.state-covid
	height: 100%
	display: flex
	align-items: center
	justify-content: center
	text-align: center
</style>
