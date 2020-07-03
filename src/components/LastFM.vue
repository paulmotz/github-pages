<template lang='pug'>
	.last-fm-wrapper
		img.logo(alt="last.fm logo" src="../assets/last-fm.png")
		.inputs
			label last.fm username
			input(v-model="username" placeholder="last.fm username")
			label uts
			input(v-model="uts" placeholder="last track uts")
		//- button(v-on:click="logTracks(username, uts)") Get tracks
		Hello
</template>

<script>
import { logTracks } from '../lib/lastfm.js';
import Hello from './Hello.vue';

export default {
	name: 'LastFM',

	compontents: {
		Hello
	},

	data: function() {
		return {
			username: 'paul_motz',
			uts: '',
		};
	},

	methods: {
		async logTracks(user, from) {
			await logTracks({ user, from });
		},
	}
}
</script>

<style lang='stylus'>
.last-fm-wrapper
	margin: 0 auto
	width: 80%

.logo
	height: 75px
	width: 75px
	display: flex
	margin: 0 auto 25px auto

.inputs
	display: grid
	grid-template-columns: 50% 50%
	grid-gap: 5px
	width: 75%
	margin: 0 auto

.inputs label
	text-align: right

button
	display: flex
	margin: 10px auto

</style>
