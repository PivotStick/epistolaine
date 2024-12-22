<script>
	import { goto } from '$app/navigation';
	import ToolbarActions from '$lib/components/ToolbarActions.svelte';

	let { data } = $props();

	let query = $state('');

	const filteredProducts = $derived.by(() => {
		const search = query.trim().toLowerCase();
		if (!search) return data.products;

		return data.products.filter((p) => p.name.toLowerCase().includes(search));
	});
</script>

<ToolbarActions title="Produits">
	<button onclick={() => goto('products/new')}>
		<iconify-icon icon="fa6-solid:plus"></iconify-icon>
		Nouveau produit
	</button>
</ToolbarActions>

{#if !data.products.length}
	<p>Ah, bon bah t'as aucun produit pour l'instant 🤷</p>
	<p>Faudrait en créer non ?</p>
{:else}
	<p>Ayooo, t'as {data.products.length} produit{data.products.length > 1 ? 's' : ''} !</p>

	<input type="text" placeholder="Petite recherche ? 😎" bind:value={query} />

	<ul class="products">
		{#each filteredProducts as product (product._id)}
			<li class="product">
				{product.name}
			</li>
		{/each}
	</ul>
{/if}
