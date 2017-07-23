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
			<tr v-for="rule in rules">
				<td>{{ rule.url }}</td>
				<td>{{ rule.replace }}</td>
				<td>
					<button>X</button>
				</td>
			</tr>
		</table>
	</div>
</template>

<script>
	export default {
		props: {
			rules: {
				type: Array,
				required: true,
			}
		}
	}
</script>
