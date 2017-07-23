<template>
	<div id="options">
		<CustomUrlTable :rules="rules"></CustomUrlTable>
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
		data: () => {
			return {
				rules: [
					{
						id: "lolwhee",
						url: "src.wordpress-develop.dev",
						replace: "lol %url HAHAHA %text %text %url 👍🏻"
					}
				]
			};
		},
	};
</script>
