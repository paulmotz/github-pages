<template lang='pug'>
	.modal-backdrop
		.modal
			header.modal-header
				slot(name="header")
			section.modal-body
				slot(name="body")
			footer.modal-footer
				slot(name="footer")
</template>

<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
	name : 'PJMModal',

	methods : {
		emitClicked(): void {
			this.$emit('clicked');
		},
	},
});
</script>

<style lang='stylus'>
@import '../assets/variables.styl'

.modal-backdrop
	position: fixed
	top: 0
	bottom: 0
	left: 0
	right: 0
	background-color: rgba(0, 0, 0, 0.3)
	display: flex
	justify-content: center
	align-items: center

.modal
	background: $modal-background-color
	box-shadow: 2px 2px 20px 1px
	overflow-x: auto
	display: flex
	flex-direction: column
	min-width: 15rem
	text-align: left

.modal-header
	background-color: $header-footer-background-color
	color: $white
	font-weight: 600
	box-sizing: border-box
	border-bottom: 2px solid $vue-green
	padding: 0.375rem

.modal-body
	padding: 0.25rem
</style>
