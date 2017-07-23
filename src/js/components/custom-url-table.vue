<template>
	<div id="custom-url-table-container">
		<h2>Custom link formats</h2>

		<p>Add custom link formats to be used on specified domains.</p>

		<p><strong>Domain</strong>: The domain to use this link format on. Basic wildcards can be used here - for example, <tt>*.pento.net</tt> will match <tt>pento.net</tt>, and any subdomains of <tt>pento.net</tt>.</p>

		<p><strong>Format</strong>: The format of the link to use. <tt>%url</tt> will be replaced with the URL pasted, and <tt>%text</tt> will be replaced with the selected text (if any). For example, <tt>[%text](%url)</tt> would give you the Markdown link format.</p>

		<table>
			<tr>
				<th>Domain</th>
				<th>Format</th>
			</tr>
			<CustomUrlTableRow
				v-for="rule in rules"
				:key="rule.id"
				:rule="rule">
			</CustomUrlTableRow>
		</table>
	</div>
</template>

<script>
	/**
	 * Internal dependencies
	 */
	import CustomUrlTableRow from 'components/custom-url-table-row';

	export default {
		name: 'custom-url-table',
		computed: {
			rules() {
				return this.$store.state.rules;
			}
		},
		components: {
			CustomUrlTableRow,
		},
	}
</script>
