<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import debounce from 'lodash/debounce';
	import type { PageData } from './$types';

	export let data: PageData;

	let form: HTMLFormElement;
	// intentionally not reactive - we don't want to clobber the input on subsequent navigations
	let initialValue = data.query ?? '';

	let hasSubmitted = false;

	const debouncedSubmit = debounce(() => {
		if (typeof HTMLFormElement.prototype.requestSubmit == 'function') {
			form.requestSubmit();
			hasSubmitted = true;
		}
	}, 300);
</script>

<div class="flex h-full flex-col gap-2">
	<form bind:this={form} data-sveltekit-replacestate data-sveltekit-keepfocus>
		<Input
			id="q"
			type="text"
			name="q"
			placeholder="Search for artist"
			autocomplete="off"
			autocorrect="off"
			autocapitalize="off"
			spellcheck="false"
			on:input={debouncedSubmit}
			value={initialValue}
		/>
	</form>

	{#if hasSubmitted}
		<ScrollArea class="rounded-md border">
			<div class="p-4">
				<h4 class="mb-4 text-sm font-medium leading-none">Artists</h4>

				{#await data.artistsPromise}
					Loading artists...
				{:then artists}
					{#if artists}
						<ul role="list" class="divide-y divide-solid">
							{#each artists as artist}
								<li class="flex min-w-0 items-center gap-x-4 py-5">
									<a href={`/artist/${artist.id}`} class="contents">
										<img
											class="h-12 w-12 flex-none rounded-full"
											src={artist.images[0]?.url}
											alt={`Artist picture for ${artist.name}`}
										/>

										<div class="min-w-0 flex-auto">
											<p class="text-sm font-semibold leading-6">{artist.name}</p>
										</div>
									</a>
								</li>
							{/each}
						</ul>
					{:else if !data.query}
						Start typing to search for an artist
					{:else}
						No artists found
					{/if}
				{:catch error}
					error loading artists: {error.message}
				{/await}
			</div>
		</ScrollArea>
	{/if}
</div>
