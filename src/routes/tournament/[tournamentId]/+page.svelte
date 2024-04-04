<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1 class="mb-2 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
	Round of {data.bracketSize}
</h1>

{#await data.bracketPromise then bracket}
	<div class="grid grid-cols-[auto_1fr_auto_1fr_auto] gap-x-2 gap-y-1">
		{#each bracket as matchUp}
			<span>{matchUp.higherSeed.seed + 1}</span>
			<span class="justify-self-start">{matchUp.higherSeed.name}</span>
			<span>v</span>
			<span class="justify-self-end">{matchUp.lowerSeed?.name ?? 'bye'}</span>
			<span class="justify-self-end"
				>{matchUp.lowerSeed?.seed ? matchUp.lowerSeed.seed + 1 : ''}</span
			>
		{/each}
	</div>
{/await}
