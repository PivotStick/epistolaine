<script>
	import { goto } from '$app/navigation';
	import { navigating } from '$app/stores';
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
	<button onclick={() => goto('products/new')} disabled={!!$navigating}>
		{#if $navigating}
			<iconify-icon icon="fa6-solid:spinner" class="fa-load"></iconify-icon>
		{:else}
			<iconify-icon icon="fa6-solid:plus"></iconify-icon>
			Nouveau produit
		{/if}
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
				<img src={product.images[0]} alt="" />
				<p class="name">{product.name}</p>
				<p>{product.price.toFixed(2)}€</p>
			</li>
		{/each}
	</ul>
{/if}

<style lang="scss">
	.products {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		gap: 1rem;
		margin-top: 2rem;

		.product {
			.name {
				font-weight: 600;
				font-size: 1.25rem;
			}

			img {
				aspect-ratio: 1;
				width: 100%;
				object-fit: cover;
				border-radius: 0.25rem;
			}
		}
	}
</style>
