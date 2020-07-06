<template lang='pug'>
	.last-fm-wrapper
		img.logo(alt="Vue logo" src="../assets/last-fm.png")
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
</template>

<script>
import { logTracks } from '../lib/lastfm.js';
import FloatingLabel from './FloatingLabel.vue';
import PJMButton from './PJMButton.vue';
import ValidatedInput from './ValidatedInput.vue';

export default {
	name : 'LastFM',

	components : {
		FloatingLabel,
		PJMButton,
		ValidatedInput
	},

	data: function() {
		return {
			isButtonLoading: false,
			userErrorMessage: '',
			username: 'paul_motz',
			fromUts: '',
			fromUtsErrorMessage: '',
			toUts: '',
			toUtsErrorMessage: '',
		};
	},

	computed : {
		shouldShowUserErrorMessage () {
			return this.username.length > 0 && this.userErrorMessage.length > 0;
		},

		shouldShowUtsErrorMessage () {
			return this.fromUts.length > 0 && this.fromUtsErrorMessage.length > 0;
		}
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

			await this.logTracks(user, from, to);
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

		async logTracks(user, from, to = '') {
			this.setIsButtonLoading(true);

			const result = await logTracks({ user, from, to });

			console.log(result)

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
