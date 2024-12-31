<script>
	import { goto, invalidateAll } from '$app/navigation';
	import { navigating } from '$app/stores';
	import { api } from '$lib/client/api';
	import Loader from '$lib/components/Loader.svelte';
	import { snacks } from '$lib/components/Snacks.svelte';
	import ToolbarActions from '$lib/components/ToolbarActions.svelte';

	let { data } = $props();

	let query = $state('');
	/**
	 * @type {Record<string, any>}
	 */
	let togglingProps = $state({});

	const filteredProducts = $derived.by(() => {
		const search = query.trim().toLowerCase();
		if (!search) return data.products;

		return data.products.filter((p) => p.name.toLowerCase().includes(search));
	});

	/**
	 * @param {string} productID
	 */
	async function deleteProduct(productID) {
		try {
			await api.action('?/deleteOne', {
				productID
			});
			snacks.success('Supprimé avec brio ! 😎');
			invalidateAll();
		} catch (error) {
			snacks.danger(
				`Ohhh oopsie ! Il y a eu un problème mais j'ai eu la flemme de mettre les détails 😬`
			);
		}
	}

	/**
	 * @param {string} productID
	 * @param {string} prop
	 */
	async function toggle(productID, prop) {
		togglingProps[productID] ??= {};
		togglingProps[productID][prop] = true;

		try {
			await api.action('?/toggleMeta', {
				productID,
				prop
			});
			await invalidateAll();
		} catch (error) {
			snacks.danger(
				`Ohhh oopsie ! Il y a eu un problème mais j'ai eu la flemme de mettre les détails 😬`
			);
		} finally {
			delete togglingProps[productID][prop];

			if (!Object.keys(togglingProps[productID]).length) {
				delete togglingProps[productID];
			}
		}
	}
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
		{#each filteredProducts as product (product.id)}
			{@const price = (product.price / 100).toFixed(2).split('.')}
			<li class="product" class:hidden={product.hidden}>
				<img src={product.images[0]} alt="" />
				<div class="details">
					<p class="name">{product.name}</p>
					<p class="price">{price[0]}.<span>{price[1]}€</span></p>

					<div class="actions">
						<button
							class={product.closed ? 'primary' : 'success'}
							onclick={() => toggle(product.id, 'closed')}
							aria-label="Toggle close product"
							disabled={togglingProps[product.id]?.closed}
						>
							<Loader loading={togglingProps[product.id]?.closed}>
								<iconify-icon icon="fa6-solid:{product.closed ? 'ban' : 'circle-check'}"
								></iconify-icon>
							</Loader>
						</button>
						<button
							onclick={() => toggle(product.id, 'hidden')}
							aria-label="Toggle product's visibility"
							disabled={togglingProps[product.id]?.hidden}
						>
							<Loader loading={togglingProps[product.id]?.hidden}>
								<iconify-icon icon="fa6-solid:{product.hidden ? 'eye-slash' : 'eye'}"
								></iconify-icon>
							</Loader>
						</button>
						<button
							class="danger"
							onclick={() => deleteProduct(product.id)}
							aria-label="Delete product"
							disabled={togglingProps[product.id]}
						>
							<iconify-icon icon="fa6-solid:trash"></iconify-icon>
						</button>
					</div>
				</div>
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
			box-shadow: 0 0.75rem 3rem -1rem var(--color-400);
			background-color: white;
			border-radius: 0.25rem;
			overflow: hidden;

			> img {
				aspect-ratio: 1;
				width: 100%;
				object-fit: cover;

				transition-property: filter;
			}

			&.hidden {
				> img {
					filter: grayscale(1);
				}
			}

			.details {
				padding: 1rem;
				display: grid;
				gap: 0.5rem;

				.name {
					font-weight: 600;
					font-size: 1rem;
				}

				.price {
					font-weight: 600;
					font-size: 1.5rem;

					span {
						font-weight: 700;
						font-size: 0.75em;
					}
				}

				.actions {
					margin-top: 1rem;
					display: flex;
					gap: 0.5rem;

					button {
						flex: 1;
					}
				}
			}
		}
	}
</style>
