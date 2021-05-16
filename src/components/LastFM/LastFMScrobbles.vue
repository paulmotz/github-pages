<template lang='pug'>
	.last-fm-wrapper
		img.logo(alt="Vue logo" src="../../assets/last-fm.png")
		FloatingLabel(labelText="Last.fm username")
				ValidatedInput(v-bind:errorMessage="userErrorMessage")
					input(v-model="username" v-on:keyup.enter="getLastFMTracks(tracks, username)")
		textarea(v-model="tracks")
		PJMButton(
			v-bind:isDisabled="isButtonLoading"
			text="Scrobble tracks"
			loadingText="Scrobbling tracks..."
			v-on:clicked="scrobbleLastFMTracks(tracks, username)")
</template>

<script lang='ts'>
import Vue from 'vue';
import { scrobbleTracks } from '@/lib/lastfm';
import { SpotifyTrack } from '@/lib/types';
import FloatingLabel from '../FloatingLabel.vue';
import PJMButton from '../PJMButton.vue';
import ValidatedInput from '../ValidatedInput.vue';

export default Vue.extend({
	name : 'LastFMScrobbles',

	components : {
		FloatingLabel,
		PJMButton,
		ValidatedInput,
	},

	data : function() {
		return {
			isButtonLoading  : false,
			tracks           : [],
			userErrorMessage : '',
			username         : 'paul_motz',
		};
	},

	watch : {
		username : function(): void {
			this.hideUserErrorMessage();
		},
	},

	methods : {
		async scrobbleLastFMTracks(tracks: string, user: string): Promise<void | undefined> {
			if (tracks === '' || JSON.parse(tracks) === []) {
				return;
			}

			if (!user) {
				this.userErrorMessage = 'Please enter a last.fm user';
			}

			if (!user) {
				return;
			}

			await this.getTracks(JSON.parse(tracks), user);
		},

		hideUserErrorMessage(): void {
			this.userErrorMessage = '';
		},

		async getTracks(tracks: SpotifyTrack[], user: string): Promise<void> {
			this.setIsButtonLoading(true);

			await scrobbleTracks({ tracks, user });

			this.setIsButtonLoading(false);
		},

		resetErrorMessages(): void {
			this.hideUserErrorMessage();
		},

		setIsButtonLoading(isButtonLoading: boolean): void {
			this.isButtonLoading = isButtonLoading;
		},
	},
});
</script>

<style lang='stylus'>
@import '../../assets/variables.styl'
.last-fm-wrapper
	display: flex
	flex-direction: column
	align-items: center
	width: 80%
	margin: 0.5rem auto 0

.logo
	height: 75px
	width: 75px
	margin-bottom: 1.25rem

.inputs
	width: 10rem

.inputs .floating-label
	display flex

.inputs input
	color: $text-color-theme-light
	width: 100%

.button-row
	display: flex
	width: 100%
	justify-content: center

button
	margin: 1.25rem 0.25rem
</style>
