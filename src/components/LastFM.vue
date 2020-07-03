<template lang='pug'>
	.last-fm-wrapper
		img.logo(alt="Vue logo" src="../assets/last-fm.png")
		.inputs
			label last.fm username
			input(v-model="username" placeholder="last.fm username")
			label uts
			input(v-model="uts" placeholder="last track uts")
		PJMButton(
			v-bind:isDisabled="isButtonLoading"
			v-bind:text="'Get tracks'"
			v-bind:loadingText="'Geting tracks...'"
			v-on:clicked="logTracks(username,uts)")
</template>

<script>
import { logTracks } from '../lib/lastfm.js';
import PJMButton from './PJMButton.vue';

export default {
	name: 'LastFM',

	components: {
		PJMButton
	},

	data: function() {
		return {
			isButtonLoading: false,
			username: 'paul_motz',
			uts: '',
		};
	},

	methods: {
		async logTracks(user, from) {
			this.setIsButtonLoading(true);

			const result = await logTracks({ user, from });

			console.log(result)

			this.setIsButtonLoading(false);
		},

		setIsButtonLoading(isButtonLoading) {
			this.isButtonLoading = isButtonLoading;
		}
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
