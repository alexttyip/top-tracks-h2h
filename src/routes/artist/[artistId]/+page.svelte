<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import * as Popover from '$lib/components/ui/popover';
	import * as Select from '$lib/components/ui/select';
	import * as Table from '$lib/components/ui/table';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex items-center justify-between">
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
		{data.artistName}
	</h1>

	<Popover.Root>
		<Popover.Trigger asChild let:builder>
			<Button builders={[builder]}>Create brackets</Button>
		</Popover.Trigger>

		<Popover.Content class="w-80">
			<div class="grid gap-4">
				<div class="space-y-2">
					<h4 class="font-medium leading-none">Bracket specs</h4>
					<p class="text-sm text-muted-foreground">Set the specs for the bracket.</p>
				</div>

				<form method="POST" class="flex flex-col gap-3">
					<div class="grid grid-cols-3 items-center gap-4">
						<Label for="width"># of tracks</Label>

						<Select.Root>
							<Select.Trigger class="col-span-2 h-8">
								<Select.Value placeholder="Select the # of tracks" />
							</Select.Trigger>

							<Select.Content>
								<Select.Group>
									{#each [4, 8, 16, 32] as size}
										<Select.Item value={size}>{size}</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>

							<Select.Input name="bracketSize" />
						</Select.Root>
					</div>

					<!-- TODO add validation -->
					<Button class="w-full" type="submit">Create</Button>
				</form>
			</div>
		</Popover.Content>
	</Popover.Root>
</div>

{#await data.tracksPromise}
	Loading tracks...
{:then tracks}
	{#if tracks}
		<Table.Root>
			<Table.Caption>A list of the artists songs, sorted by popularity.</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head>ID</Table.Head>
					<Table.Head>Name</Table.Head>
					<Table.Head>Popularity</Table.Head>
				</Table.Row>
			</Table.Header>

			<Table.Body>
				{#each tracks as track}
					<Table.Row>
						<Table.Cell>{track.id}</Table.Cell>
						<Table.Cell>{track.name}</Table.Cell>
						<Table.Cell>{track.popularity}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{:else}
		No tracks found
	{/if}
{:catch error}
	error loading tracks: {error.message}
{/await}
