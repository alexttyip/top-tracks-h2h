<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<table>
	<tr>
		<th>ID</th>
		<th>Name</th>
		<th>Popularity</th>
	</tr>
	{#each data.tracks as track}
		<tr>
			<td>{track.id}</td>
			<td>{track.name}</td>
			<td>{track.popularity}</td>
		</tr>
	{/each}
</table>
