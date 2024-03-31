<script lang="ts">
	import type { PageData } from './$types';
	import debounce from 'lodash/debounce';

	export let data: PageData;

	let form: HTMLFormElement;
	// intentionally not reactive - we don't want to clobber the input on subsequent navigations
	let initialValue = data.query ?? '';
	let artists = data.result ?? [];

	const debouncedSubmit = debounce(() => {
		if (typeof HTMLFormElement.prototype.requestSubmit == 'function') {
			form.requestSubmit();
		}
	}, 300);
</script>

<form bind:this={form} data-sveltekit-replacestate data-sveltekit-keepfocus>
	<label for="q">Query</label>

	<input
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

<ul>
	{#each artists as artist}
		<li>{artist}</li>
	{/each}
</ul>
