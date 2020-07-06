<template lang='pug'>
	table.sortable-table(v-if="tableData.length > 0")
		tr
			th.track-header(v-for="column in columnData" v-on:click="sort(column.columnName)") {{ column.columnLabel }}
		tr(v-for="row in tableData")
			td.track(v-for="column in columnData") {{ row[column.columnName] }}
</template>

<script>
export default {
	name: 'SortableTable',
	
	data: function() {
		return {
			tableData: Array
		}
	},

	watch : {
		tableDataProp : function() {
			this.tableData = [ ...this.tableDataProp ];
		}
	},

	props : {
		columnData   : Array,
		tableDataProp : Array
	},

	mounted() {
		this.tableData = [ ...this.tableDataProp ];
	},

	methods : {
		sort(fieldName) {
			const isNumericValue = typeof this.tableData[0][fieldName] === 'number';
			
			this.tableData.sort((a, b) => {
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
@import '../assets/variables.styl'
.sortable-table
	display: table-header-group
	width: 500px

tr th
	text-align: left

td
	width: 25%
</style>
