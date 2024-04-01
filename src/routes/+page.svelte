<script lang="ts">
	import type { PageData } from './$types';
	import debounce from 'lodash/debounce';
	import { Input } from '$lib/components/ui/input';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';

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

<main class="m-auto flex h-full max-h-full w-full max-w-xl flex-col gap-2 py-5">
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
						{#each artists as artist}
							<a href={`/artist/${artist.id}`} class="text-sm">
								{artist.name}
							</a>

							<Separator class="my-2" />
						{/each}
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
</main>
