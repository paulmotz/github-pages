<template lang='pug'>
	.provincial-covid
		h1 CANADA
</template>

<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
	name : 'ProvincialCOVID',
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='stylus'>
@import '../../assets/colors.styl'

.provincial-covid
	height: 100%
	display: flex
	align-items: center
	justify-content: center
	text-align: center
</style>
