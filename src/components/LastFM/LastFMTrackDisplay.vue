<template lang='pug'>
	table.last-fm-track-display(v-if="lastFMData && lastFMData.scrobbleCounts")
		tr
			th.track-header(v-on:click="sort('track')") {{ 'Track' }}
			th.track-header(v-on:click="sort('artist')") {{ 'Artists' }}
			th.track-header(v-on:click="sort('album')") {{ 'Album' }}
			th.track-header(v-on:click="sort('scrobbleCount')") {{ 'ScrobbleCounts' }}
		tr.last-fm-row(v-for="track in lastFMData.scrobbleCounts")
			td.track {{ track.track }}
			td.track {{ track.artist }}
			td.track {{ track.album }}
			td.track {{ track.scrobbleCount }}
</template>

<script>
export default {
	name: 'LastFMTrackDisplay',
	
	data: function() {
		return {
			lastFMData: Object
		}
	},

	watch : {
		lastFMDataProp : function() {
			this.lastFMData = { ...this.lastFMDataProp };
		}
	},

	props : {
		lastFMDataProp: Object
	},

	mounted() {
		this.lastFMData = { ...this.lastFMDataProp };
	},

	methods : {
		sort(fieldName) {
			const isNumericValue = typeof this.lastFMData.scrobbleCounts[0][fieldName] === 'number';
			
			this.lastFMData.scrobbleCounts.sort((a, b) => {
				if (a[fieldName] < b[fieldName] && !isNumericValue || a[fieldName] > b[fieldName] && isNumericValue) {
					return -1;
				}
				if (a[fieldName] > b[fieldName] && !isNumericValue || a[fieldName] < b[fieldName] && isNumericValue) {
					return 1;
				}
				return 0;
			});
		},
	}
}
</script>

<style lang='stylus'>
@import '../../assets/variables.styl'
.last-fm-track-display
	display: table-header-group
	width: 500px

tr th
	text-align: left

td
	width: 25%
</style>
