<script>
	import { ADMIN_BASE_URL } from '$lib/constants';
	import { page } from '$app/stores';

	let { children } = $props();

	const links = [
		{
			endpoint: '',
			icon: 'house',
			text: 'Accueil'
		},
		{
			endpoint: '/products',
			icon: 'cube',
			text: 'Produits'
		}
	];
</script>

<div class="page">
	<nav>
		<ul>
			{#each links as link}
				{@const href = `/${ADMIN_BASE_URL}${link.endpoint}`}
				<li>
					<a {href} aria-current={href === $page.url.pathname ? 'page' : null}>
						<iconify-icon icon="fa6-solid:{link.icon}"></iconify-icon>
						{link.text}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
	<main>
		{@render children()}
	</main>
</div>

<style>
	.page {
		display: grid;
		grid-template-columns: auto 1fr;
		height: 100dvh;

		nav {
			padding: 2rem;

			box-shadow: 1rem 0 2rem -2rem var(--color-900);
			background-color: white;

			ul {
				display: grid;
				gap: 0.5rem;

				a {
					display: flex;
					align-items: center;
					gap: 0.75rem;
					text-decoration: none;
					padding: 0.5rem 0.7rem;
					border-radius: 0.5rem;
					opacity: 0.75;

					transition-property: opacity, background-color, color;

					&:hover {
						opacity: 1;
						background-color: var(--color-100);
						color: var(--on-color-100);
					}

					&:active {
						opacity: 0.5;
					}

					&[aria-current='page'] {
						pointer-events: none;
						opacity: 1;
						background-color: var(--color-200);
						color: var(--on-color-200);
					}
				}
			}
		}

		main {
			padding: 2rem 3rem;
			overflow: auto;
		}
	}
</style>
