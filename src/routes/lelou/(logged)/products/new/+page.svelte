<script>
	import ToolbarActions from '$lib/components/ToolbarActions.svelte';
	import { snacks } from '$lib/components/Snacks.svelte';
	import { goto } from '$app/navigation';
	import { ADMIN_BASE_URL } from '$lib/constants';
	import * as z from 'zod';

	const schema = z.object({
		name: z.string().min(1),
		description: z.string().min(1),
		price: z.number()
	});

	const payload = $state({
		name: '',
		description: '',
		price: null
	});

	const valid = $derived(schema.safeParse(payload).success);

	/**
	 * @param {SubmitEvent} e
	 */
	async function save(e) {
		e.preventDefault();

		console.log($state.snapshot(payload));

		snacks.danger("Heeeyyyy, c'est pas encore finish calme toi 😂");
	}
</script>

<ToolbarActions title="Nouveau produit">
	{#snippet leading()}
		<button
			onclick={() => goto(`/${ADMIN_BASE_URL}/products`)}
			aria-label="Revenir sur les produits"
		>
			<iconify-icon icon="fa6-solid:arrow-left"></iconify-icon>
		</button>
	{/snippet}
</ToolbarActions>

<p>ooohhh un nouveau produit 😍</p>

<form onsubmit={save}>
	<input type="text" placeholder="C'est quoi le nom ?" bind:value={payload.name} />
	<textarea rows="10" placeholder="Une petite description ?" bind:value={payload.description}
	></textarea>
	<label>
		<p class="info">(Le prix sera en euro hein)</p>
		<input type="number" placeholder="Hmmm, et le prix ? 🤔" bind:value={payload.price} />
	</label>

	<button disabled={!valid}>
		Aller je valide 😎
		<iconify-icon icon="fa6-solid:floppy-disk"></iconify-icon>
	</button>
</form>

<style>
	form {
		display: grid;
		gap: 1rem;
		margin-top: 1rem;
	}

	.info {
		font-size: 0.8rem;
		font-style: italic;
	}
</style>
