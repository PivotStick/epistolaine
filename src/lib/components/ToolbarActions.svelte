<script>
	/**
	 * @type {{
	 *  title: string;
	 *  children?: import("svelte").Snippet;
	 *  leading?: import("svelte").Snippet;
	 * }}
	 */
	let { title, children, leading } = $props();
</script>

<div class="tools">
	{#if leading}
		<div class="actions">
			{@render leading()}
		</div>
	{/if}

	<h1>{title}</h1>

	{#if children}
		<div class="actions">
			{@render children()}
		</div>
	{/if}
</div>

<style lang="scss">
	.tools {
		display: flex;
		align-items: center;

		gap: 2rem;
		margin-bottom: 1.5rem;

		h1 {
			line-height: 1;
		}

		.actions {
			display: flex;
			align-items: center;

			gap: 0.5rem;
		}
	}
</style>
