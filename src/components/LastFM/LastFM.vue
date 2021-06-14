<template lang='pug'>
	.last-fm-wrapper
		img.logo(alt="Vue logo" src="../../assets/last-fm.png")
		.inputs
			FloatingLabel(labelText="Last.fm username")
				ValidatedInput(v-bind:errorMessage="userErrorMessage")
					input(v-model="username" v-on:keyup.enter="getLastFMTracks(username, apiKey, fromUts, toUts)")
			FloatingLabel(labelText="Last.fm API key")
				ValidatedInput(v-bind:errorMessage="apiKeyErrorMessage")
					input(v-model="apiKey" v-on:keyup.enter="getLastFMTracks(username, apiKey, fromUts, toUts)")
			FloatingLabel(labelText="First track uts")
				ValidatedInput(v-bind:errorMessage="fromUtsErrorMessage")
					input(v-model="fromUts" v-on:keyup.enter="getLastFMTracks(username, apiKey, fromUts, toUts)")
			FloatingLabel(labelText="Last track uts (optional)")
				ValidatedInput(v-bind:errorMessage="toUtsErrorMessage")
					input(v-model="toUts" v-on:keyup.enter="getLastFMTracks(username, apiKey, fromUts, toUts)")
		.button-row
			PJMButton(
				v-bind:isDisabled="isButtonLoading"
				text="Get tracks"
				loadingText="Geting tracks..."
				v-on:clicked="getLastFMTracks(username, apiKey, fromUts, toUts)")
			PJMButton(
				v-bind:isDisabled="!hasTracks"
				v-bind:text="showTracksText"
				v-on:clicked="toggleShowTracks")
		SortableTable(
			v-bind:tableDataProp="scrobbleCounts"
			v-bind:columnData="lastFmColumnData"
			v-show="shouldShowTracks")
</template>

<script lang='ts'>
import Vue from 'vue';
import { getTracks } from '@/lib/lastfm';
import { LastFmTrackInfo, ScrobbleCount } from '@/lib/types';
import FloatingLabel from '../FloatingLabel.vue';
import SortableTable from '../SortableTable.vue';
import PJMButton from '../PJMButton.vue';
import ValidatedInput from '../ValidatedInput.vue';

export default Vue.extend({
	name : 'LastFM',

	components : {
		FloatingLabel,
		PJMButton,
		SortableTable,
		ValidatedInput,
	},

	data : function() {
		return {
			apiKey             : process.env.VUE_APP_LASTFM_API_KEY || '',
			apiKeyErrorMessage : '',
			isButtonLoading    : false,
			lastFmColumnData   : [
				{
					columnLabel : 'Track',
					columnName  : 'track',
				},
				{
					columnLabel : 'Artist',
					columnName  : 'artist',
				},
				{
					columnLabel : 'Album',
					columnName  : 'album',
				},
				{
					columnLabel : 'Scrobbles',
					columnName  : 'scrobbleCount',
				},
			],
			lastTrackInfo       : '',
			userErrorMessage    : '',
			username            : 'paul_motz',
			fromUts             : '1623607327',
			fromUtsErrorMessage : '',
			scrobbleCounts      : [] as ScrobbleCount[],
			shouldShowTracks    : true,
			totalScrobbles      : 0,
			toUts               : '',
			toUtsErrorMessage   : '',
		};
	},

	computed : {
		hasTracks(): boolean {
			return this.scrobbleCounts.length > 0;
		},

		showTracksText(): string {
			return this.shouldShowTracks && this.hasTracks ? 'Hide Tracks' : 'Show Tracks';
		},
	},

	watch : {
		username : function(): void {
			this.hideUserErrorMessage();
		},

		fromUts : function(): void {
			this.hideFromUtsErrorMessage();
		},

		apiKey : function(): void {
			this.hideApiKeyErrorMessage();
		},

		toUts : function(): void {
			this.hideToUtsErrorMessage();
		},
	},

	methods : {
		async getLastFMTracks(user: string, apiKey: string, from: string, to: string): Promise<LastFmTrackInfo | undefined> {
			this.resetErrorMessages();

			if (!user) {
				this.userErrorMessage = 'Please enter a last.fm user';
			}

			if (!apiKey) {
				this.apiKeyErrorMessage = 'Please enter an API Key';
			}

			if (!from) {
				this.fromUtsErrorMessage = 'Please enter a starting uts';
			}

			const isToUtsLessThanFromUts = Number(to) < Number(from) && to !== '';

			if (isToUtsLessThanFromUts) {
				this.toUtsErrorMessage = 'Invalid last track uts';
			}

			if (!user || !apiKey || !from || isToUtsLessThanFromUts) {
				return;
			}

			await this.getTracks(user, apiKey, from, to);
		},

		hideUserErrorMessage(): void {
			this.userErrorMessage = '';
		},

		hideApiKeyErrorMessage(): void {
			this.apiKeyErrorMessage = '';
		},

		hideFromUtsErrorMessage(): void {
			this.fromUtsErrorMessage = '';
		},

		hideToUtsErrorMessage(): void {
			this.toUtsErrorMessage = '';
		},

		async getTracks(user: string, apiKey: string, from: string, to = ''): Promise<void> {
			this.setIsButtonLoading(true);

			const lastFmData: LastFmTrackInfo = await getTracks({ user, apiKey, from, to });

			this.lastTrackInfo = lastFmData.lastTrackInfo;
			this.scrobbleCounts = lastFmData.scrobbleCounts;
			this.totalScrobbles = lastFmData.totalScrobbles;

			this.setIsButtonLoading(false);
		},

		toggleShowTracks(): void {
			this.shouldShowTracks = !this.shouldShowTracks;
		},

		resetErrorMessages(): void {
			this.hideUserErrorMessage();
			this.hideFromUtsErrorMessage();
			this.hideToUtsErrorMessage();
		},

		setIsButtonLoading(isButtonLoading: boolean): void {
			this.isButtonLoading = isButtonLoading;
		},
	},
});
</script>

<style lang='stylus'>
@import '../../assets/colors.styl'
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

.sortable-table
	width: 100%
	table-layout: fixed;

	td
		overflow: hidden
		white-space: nowrap
		text-overflow: ellipsis;

	td:nth-child(1)
		width: 35%
		max-width: 600px

	td:nth-child(2)
		width: 35%
		max-width: 600px

	td:nth-child(3)
		width: 10%
		max-width: 200px
		overflow: hidden
		white-space: nowrap
		text-overflow: ellipsis;

	@media only screen and (max-width: 1440px)
		td:nth-child(1), td:nth-child(2)
			max-width: 400px

	td:nth-child(4)
		width: 10%
</style>
