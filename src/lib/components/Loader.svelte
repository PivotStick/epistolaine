<script>
	let { loading = false, children } = $props();
</script>

{#if loading}
	<iconify-icon icon="fa6-solid:spinner" class="fa-load"></iconify-icon>
{:else}
	{@render children()}
{/if}
