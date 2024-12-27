<script>
	import ToolbarActions from '$lib/components/ToolbarActions.svelte';
	import { snacks } from '$lib/components/Snacks.svelte';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/stores';
	import { ADMIN_BASE_URL } from '$lib/constants';
	import { files } from '$lib/client/files';
	import { api } from '$lib/client/api';

	import { scale, slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { expoOut } from 'svelte/easing';

	import * as z from 'zod';

	const schema = z.object({
		name: z.string().min(1),
		description: z.string().min(1),
		images: z.array(z.string()).min(1),
		price: z.number()
	});

	const payload = $state({
		name: '',
		description: '',
		images: /** @type {string[]} */ ([]),
		price: null
	});

	/** @type {null | FileList} */
	let imageFiles = $state(null);
	let submitting = $state(false);

	const valid = $derived(schema.safeParse(payload).success);

	/**
	 * @param {SubmitEvent} e
	 */
	async function save(e) {
		e.preventDefault();

		submitting = true;
		try {
			await api.action('?/newProduct', schema.parse(payload));

			snacks.success(`Hopela ! Et voilà 😎`);
			goto(`/${ADMIN_BASE_URL}/products`);
		} catch (error) {
			snacks.danger(
				`Une erreur est survenue, mais pas de détails sorry 😬. (J'avais la flemme c'est ma faute)`
			);
		} finally {
			submitting = false;
		}
	}

	$effect(() => {
		if (imageFiles) {
			Promise.all([...imageFiles].map(files.read)).then((out) => {
				payload.images = out;
			});
		}
	});
</script>

<ToolbarActions title="Nouveau produit">
	{#snippet leading()}
		<button
			onclick={() => goto(`/${ADMIN_BASE_URL}/products`)}
			aria-label="Revenir sur les produits"
			disabled={!!$navigating}
		>
			{#if $navigating}
				<iconify-icon icon="fa6-solid:spinner" class="fa-load"></iconify-icon>
			{:else}
				<iconify-icon icon="fa6-solid:arrow-left"></iconify-icon>
			{/if}
		</button>
	{/snippet}
</ToolbarActions>

<p>ooohhh un nouveau produit 😍</p>

<form onsubmit={save}>
	<input
		type="text"
		placeholder="C'est quoi le nom ?"
		bind:value={payload.name}
		disabled={submitting}
	/>
	<label>
		<p class="info">Des images !</p>
		<input type="file" bind:files={imageFiles} multiple disabled={submitting} />
	</label>
	{#if payload.images.length}
		<p class="info" transition:slide={{ easing: expoOut }}>La première sera la couverture 😎</p>
		<div class="images" transition:slide={{ easing: expoOut }}>
			{#each payload.images as image, i (image)}
				<div
					class="image"
					animate:flip={{ easing: expoOut, duration: 600 }}
					out:scale={{ easing: expoOut }}
				>
					<img src={image} alt="" />
					<div class="actions">
						<button
							type="button"
							aria-label="Move to left"
							disabled={i === 0 || submitting}
							onclick={() => {
								payload.images.splice(i, 1);
								payload.images.splice(i - 1, 0, image);
							}}
						>
							<iconify-icon icon="fa6-solid:arrow-left"></iconify-icon>
						</button>
						<button
							type="button"
							aria-label="Remove"
							onclick={() => {
								payload.images.splice(i, 1);
							}}
							disabled={submitting}
						>
							<iconify-icon icon="fa6-solid:trash"></iconify-icon>
						</button>
						<button
							type="button"
							aria-label="Move to right"
							disabled={i === payload.images.length - 1 || submitting}
							onclick={() => {
								payload.images.splice(i, 1);
								payload.images.splice(i + 1, 0, image);
							}}
						>
							<iconify-icon icon="fa6-solid:arrow-right"></iconify-icon>
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
	<textarea
		rows="10"
		placeholder="Une petite description ?"
		bind:value={payload.description}
		disabled={submitting}
	></textarea>
	<label>
		<p class="info">(Le prix sera en euro hein)</p>
		<input
			type="number"
			placeholder="Hmmm, et le prix ? 🤔"
			bind:value={payload.price}
			disabled={submitting}
		/>
	</label>

	<button type="submit" disabled={!valid || submitting}>
		{#if submitting}
			<iconify-icon icon="fa6-solid:spinner" class="fa-load"></iconify-icon>
		{:else}
			Aller je valide 😎
			<iconify-icon icon="fa6-solid:floppy-disk"></iconify-icon>
		{/if}
	</button>
</form>

<style lang="scss">
	form {
		display: grid;
		gap: 1rem;
		margin-top: 1rem;
	}

	.images {
		display: flex;
		gap: 1rem;

		overflow: auto;
		border-radius: 0.25rem;
		padding-bottom: 3px;

		.image {
			img {
				display: block;
				height: 16rem;
				aspect-ratio: 1;
				border-radius: 0.25rem;
				background-color: var(--color-200);
				object-fit: cover;

				box-shadow: 0 0.5rem 2rem -1.5rem var(--color-600);
			}

			.actions {
				display: flex;
				justify-content: space-between;
				margin-top: 0.5rem;
			}
		}
	}

	.info {
		font-size: 0.8rem;
		font-style: italic;
	}
</style>
