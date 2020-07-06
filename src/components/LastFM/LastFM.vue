<template lang='pug'>
	.last-fm-wrapper
		img.logo(alt="Vue logo" src="../../assets/last-fm.png")
		.inputs
			FloatingLabel(v-bind:labelText="'Last.fm username'")
				ValidatedInput(v-bind:errorMessage="userErrorMessage")
					input(v-model="username" v-on:keyup.enter="getLastFMTracks(username, fromUts, toUts)")
			FloatingLabel(v-bind:labelText="'First track uts'")
				ValidatedInput(v-bind:errorMessage="fromUtsErrorMessage")
					input(v-model="fromUts" v-on:keyup.enter="getLastFMTracks(username, fromUts, toUts)")
			FloatingLabel(v-bind:labelText="'Last track uts (optional)'")
				ValidatedInput(v-bind:errorMessage="toUtsErrorMessage")
					input(v-model="toUts" v-on:keyup.enter="getLastFMTracks(username, fromUts, toUts)")
		PJMButton(
			v-bind:isDisabled="isButtonLoading"
			v-bind:text="'Get tracks'"
			v-bind:loadingText="'Geting tracks...'"
			v-on:clicked="getLastFMTracks(username, fromUts, toUts)")
		LastFMTrackDisplay(v-bind:lastFMDataProp="lastFMData")
</template>

<script>
import { getTracks } from '../../lib/lastfm.js';
import FloatingLabel from '../FloatingLabel.vue';
import LastFMTrackDisplay from './LastFMTrackDisplay.vue';
import PJMButton from '../PJMButton.vue';
import ValidatedInput from '../ValidatedInput.vue';

export default {
	name : 'LastFM',

	components : {
		FloatingLabel,
		LastFMTrackDisplay,
		PJMButton,
		ValidatedInput
	},

	data: function() {
		return {
			isButtonLoading: false,
			userErrorMessage: '',
			username: 'paul_motz',
			fromUts: '1592927031',
			fromUtsErrorMessage: '',
			toUts: '1592937031',
			toUtsErrorMessage: '',
			lastFMData: {},
		};
	},

	watch : {
		username : function() {
			this.hideUserErrorMessage();
		},

		fromUts : function() {
			this.hideFromUtsErrorMessage();
		},

		toUts : function() {
			this.hideToUtsErrorMessage();
		}
	},

	methods : {
		async getLastFMTracks(user, from, to) {
			this.resetErrorMessages();

			if (!user) {
				this.userErrorMessage = 'Please enter a last.fm user'
			}

			if (!from) {
				this.fromUtsErrorMessage = 'Please enter a starting uts'
			}

			const isToUtsLessThanFromUts = Number(to) < Number(from) && to !== '';

			if (isToUtsLessThanFromUts) {
				this.toUtsErrorMessage = 'Invalid last track uts'
			}

			if (!user || !from || isToUtsLessThanFromUts) {
				return;
			}

			await this.getTracks(user, from, to);
		},

		hideUserErrorMessage() {
			this.userErrorMessage = '';
		},

		hideFromUtsErrorMessage() {
			this.fromUtsErrorMessage = '';
		},

		hideToUtsErrorMessage() {
			this.toUtsErrorMessage = '';
		},

		async getTracks(user, from, to = '') {
			this.setIsButtonLoading(true);

			this.lastFMData = await getTracks({ user, from, to });

			this.setIsButtonLoading(false);
		},

		resetErrorMessages() {
			this.hideUserErrorMessage();
			this.hideFromUtsErrorMessage();
			this.hideToUtsErrorMessage();
		},

		setIsButtonLoading(isButtonLoading) {
			this.isButtonLoading = isButtonLoading;
		}
	}
}
</script>

<style lang='stylus'>
.last-fm-wrapper
	display: flex
	flex-direction: column
	align-items: center
	width: 80%

.logo
	height: 75px
	width: 75px
	margin-bottom: 1.25rem

.inputs
	width: 10rem

.inputs .floating-label
	display flex

.inputs input
	width: 100%

button
	display: flex
	margin-top: 1.25rem
</style>
