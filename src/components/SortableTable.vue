<template lang='pug'>
	table.sortable-table(v-if="tableData.length > 0")
		tr.table-header-row
			th.table-header-item(v-for="(column, columnHeaderIndex) in columnData" v-bind:key="columnHeaderIndex" v-on:click="sort(column.columnName)") {{ column.columnLabel }}
				span.caret-up(v-bind:class="{ 'up-clicked' : column.columnName === currentlySortedColumn && isCurrentlySortedAscending }")
				span.caret-down(v-bind:class="{ 'down-clicked' : column.columnName === currentlySortedColumn && !isCurrentlySortedAscending }")
		tr.table-row(v-for="(row, rowIndex) in tableData" v-bind:key="rowIndex")
			td.table-cell(v-for="(column, columnIndex) in columnData" v-bind:key="columnIndex") {{ row[column.columnName] }}
</template>

<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
	name : 'SortableTable',

	props : {
		columnData : {
			type    : Array,
			default : (): [] => [],
		},
		tableDataProp : {
			type    : Array,
			default : (): [] => [],
		},
	},
	
	data : function() {
		return {
			currentlySortedColumn      : '',
			isCurrentlySortedAscending : true,
			tableData                  : [] as any[],
		};
	},

	watch : {
		tableDataProp : function(): void {
			this.tableData = [ ...this.tableDataProp ];
		},
	},

	mounted(): void {
		this.tableData = [ ...this.tableDataProp ];
	},

	methods : {
		sort(fieldName: string): void {
			const shouldInvertSort = this.currentlySortedColumn === fieldName && this.isCurrentlySortedAscending;
			
			this.tableData.sort((a, b) => {
				if (a[fieldName] < b[fieldName]) {
					return shouldInvertSort ? 1 : -1;
				}
				if (a[fieldName] > b[fieldName]) {
					return shouldInvertSort ? -1 : 1;
				}
				return 0;
			});

			this.isCurrentlySortedAscending = this.currentlySortedColumn !== fieldName || !this.isCurrentlySortedAscending;
			this.currentlySortedColumn      = fieldName;
		},
	},
});
</script>

<style lang='stylus'>
@import '../assets/variables.styl'
.sortable-table
	display: table-header-group

tr th
	text-align: left

td
	width: 25%

table
	border-collapse: collapse

.table-header-row
	border-bottom: 2px solid
	border-color: rgb(32, 32, 32)
	box-sizing: border-box
	cursor: pointer

[data-theme='dark'] .table-header-row
	border-color: rgb(212, 212, 212)

.table-row
	border-bottom: 1px solid
	border-color: rgba(196, 196, 196, 0.7)
	box-sizing: border-box

.table-row:nth-child(odd)
	background-color: $table-color--odd-light

.table-row:nth-child(even)
	background-color: $table-color--even-light

[data-theme='dark'] .table-row:nth-child(odd)
	background-color: $table-color--odd-dark

[data-theme='dark'] .table-row:nth-child(even)
	background-color: $table-color--even-dark

.caret-up
	width: 0
	height: 0
	border-left: 5px solid transparent
	border-right: 5px solid transparent

	border-bottom: 5px solid #aaa
	position: relative
	bottom: 17px
	left: 5px

.caret-down
	width: 0
	height: 0
	border-left: 5px solid transparent
	border-right: 5px solid transparent

	border-top: 5px solid #aaa
	position: relative
	bottom: -17px
	right: 5px

.up-clicked
	border-bottom: 5px solid #333

[data-theme='dark'] .up-clicked
	border-bottom: 5px solid #fff

.down-clicked
	border-top: 5px solid #333

[data-theme='dark'] .down-clicked
	border-top: 5px solid #fff

.table-cell
	padding: 4px

</style>
