<template lang='pug'>
	.floating-label
		label.label(
			v-bind:class="classObject"
		) {{ labelText }}
		slot
</template>

<script>
export default {
	// Adopted from https://github.com/bartkozal/vue-float-label
	name : 'FloatingLabel',

	props : {
		labelText : String,
	},

	data() {
		return {
			formEl    : undefined,
			labelEl   : undefined,
			isActive  : false,
			isFocused : false,
		};
	},

	computed : {
		classObject () {
			return {
				'is-active'  : this.isActive,
				'is-focused' : this.isFocused,
			};
		},
	},

	mounted () {
		this.formEl = this.$el.querySelector('input, textarea, select');

		this.formEl.addEventListener('input', this.updateIsActive);
		this.formEl.addEventListener('input', this.updateIsFocused);
		this.formEl.addEventListener('blur', this.updateIsFocused);
		this.formEl.addEventListener('focus', this.updateIsFocused);

		this.labelEl = this.$el.querySelector('label');
		this.labelEl.addEventListener('click', this.focusFormEl);

		this.setInitialIsActive();
	},

	beforeDestroy () {
		this.formEl.removeEventListener('input', this.updateIsActive);
		this.formEl.removeEventListener('input', this.updateIsFocused);
		this.formEl.removeEventListener('blur', this.updateIsFocused);
		this.formEl.removeEventListener('focus', this.updateIsFocused);
	},

	methods : {
		emitClicked() {
			this.$emit('clicked');
		},

		focusFormEl() {
			this.formEl.focus();
		},

		setInitialIsActive() {
			this.isActive = this.formEl.value.length > 0;
		},

		updateIsActive(e) {
			this.isActive = e.target.value.length > 0;
		},

		updateIsFocused(e) {
			this.isFocused = e.target === document.activeElement && this.isActive;
		},
	},
};
</script>

<style lang='stylus'>
@import '../assets/variables.styl'

.floating-label
	margin-top: 1.5rem;
	position: relative

.label
	position: absolute
	top: 0.1875em
	right: 0
	left: 0.25rem
	overflow: hidden
	font-size: 0.8125em
	transition: all 0.2s ease-out;
	pointer-events: none
	opacity: 0.5

.is-active
	pointer-events: all
	opacity: 1
	top: -1.5em

.is-focused
	color: $active-floating-label-color
</style>
