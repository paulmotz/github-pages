<template lang='pug'>
	.hello
</template>

<script>
import Vue from 'vue';
import LastFM from './LastFM/LastFM.vue';

export default Vue.extend({
	name : 'HelloWorld',

	compontents : {
		LastFM,
	},

	props : {
		msg : {
			type    : String,
			default : '',
		},
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='stylus'>
@import '../assets/variables.styl'

h3
	margin: 40px 0 0

ul
	list-style-type: none
	padding: 0

li
	display: inline-block
	margin: 0 10px

a
	color: $link-color
</style>
