<template>
	<div id="options">
		<CustomUrlTable></CustomUrlTable>
	</div>
</template>

<script>
	/**
	 * Internal dependencies
	 */
	import CustomUrlTable from 'components/custom-url-table';

	export default {
		name: 'options',
		components: {
			CustomUrlTable,
		},
	};
</script>
