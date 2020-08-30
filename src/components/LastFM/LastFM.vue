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
		.button-row
			PJMButton(
				v-bind:isDisabled="isButtonLoading"
				v-bind:text="'Get tracks'"
				v-bind:loadingText="'Geting tracks...'"
				v-on:clicked="getLastFMTracks(username, fromUts, toUts)")
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
			isButtonLoading  : false,
			lastFmColumnData : [
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
					columnLabel : 'Scrobble Counts',
					columnName  : 'scrobbleCount',
				},
			],
			lastTrackInfo       : '',
			userErrorMessage    : '',
			username            : 'paul_motz',
			fromUts             : '1598197972',
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

		toUts : function(): void {
			this.hideToUtsErrorMessage();
		},
	},

	methods : {
		async getLastFMTracks(user: string, from: string, to: string): Promise<LastFmTrackInfo | undefined> {
			this.resetErrorMessages();

			if (!user) {
				this.userErrorMessage = 'Please enter a last.fm user';
			}

			if (!from) {
				this.fromUtsErrorMessage = 'Please enter a starting uts';
			}

			const isToUtsLessThanFromUts = Number(to) < Number(from) && to !== '';

			if (isToUtsLessThanFromUts) {
				this.toUtsErrorMessage = 'Invalid last track uts';
			}

			if (!user || !from || isToUtsLessThanFromUts) {
				return;
			}

			await this.getTracks(user, from, to);
		},

		hideUserErrorMessage(): void {
			this.userErrorMessage = '';
		},

		hideFromUtsErrorMessage(): void {
			this.fromUtsErrorMessage = '';
		},

		hideToUtsErrorMessage(): void {
			this.toUtsErrorMessage = '';
		},

		async getTracks(user: string, from: string, to = ''): Promise<void> {
			this.setIsButtonLoading(true);

			const lastFmData: LastFmTrackInfo = await getTracks({ user, from, to });

			this.lastTrackInfo = lastFmData.lastTrackInfo;
			this.scrobbleCounts = lastFmData.scrobbleCounts;
			this.totalScrobbles = lastFmData.totalScrobbles;

			console.log(lastFmData);
			console.log(this.totalScrobbles);
			console.log(this.lastTrackInfo);

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
	color: $text-color
	width: 100%

.button-row
	display: flex
	width: 100%
	justify-content: center

button
	margin: 1.25rem 0.25rem
</style>
