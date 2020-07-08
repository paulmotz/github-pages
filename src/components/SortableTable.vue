<template lang='pug'>
	table.sortable-table(v-if="tableData.length > 0")
		tr.table-header-row
			th.table-header-item(v-for="(column, columnHeaderIndex) in columnData" v-bind:key="columnHeaderIndex" v-on:click="sort(column.columnName)") {{ column.columnLabel }}
				span.caret-up(v-bind:class="{ 'up-clicked' : column.columnName === currentlySortedColumn && isCurrentlySortedAscending }")
				span.caret-down(v-bind:class="{ 'down-clicked' : column.columnName === currentlySortedColumn && !isCurrentlySortedAscending }")
		tr.table-row(v-for="(row, rowIndex) in tableData" v-bind:key="rowIndex")
			td.table-cell(v-for="(column, columnIndex) in columnData" v-bind:key="columnIndex") {{ row[column.columnName] }}
</template>

<script>
export default {
	name : 'SortableTable',
	
	data : function() {
		return {
			currentlySortedColumn      : '',
			isCurrentlySortedAscending : true,
			tableData                  : [],
		};
	},

	watch : {
		tableDataProp : function() {
			this.tableData = [ ...this.tableDataProp ];
		},
	},

	props : {
		columnData    : Array,
		tableDataProp : Array,
	},

	mounted() {
		this.tableData = [ ...this.tableDataProp ];
	},

	methods : {
		sort(fieldName) {
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
};
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

.table-row
	border-bottom: 1px solid
	border-color: rgba(196, 196, 196, 0.7)
	box-sizing: border-box

.caret-up {
	width: 0
	height: 0
	border-left: 5px solid transparent
	border-right: 5px solid transparent

	border-bottom: 5px solid #ccc
	position: relative
	bottom: 17px
	left: 5px
}

.caret-down {
	width: 0
	height: 0
	border-left: 5px solid transparent
	border-right: 5px solid transparent

	border-top: 5px solid #ccc
	position: relative
	bottom: -17px
	right: 5px
}

.up-clicked {
	border-bottom: 5px solid #333
}

.down-clicked {
	border-top: 5px solid #333
}
</style>
