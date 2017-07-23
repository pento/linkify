<template>
	<tr>
		<td>{{ rule.url }}</td>
		<td>{{ rule.replace }}</td>
		<td>
			<button>X</button>
		</td>
	</tr>
</template>

<script>
	export default {
		props: {
			rule: {
				type: Object,
				required: true,
			},
		},
	};
</script>
