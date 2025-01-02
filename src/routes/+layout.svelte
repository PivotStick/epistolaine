<script>
	import '../app.scss';
	import 'iconify-icon/dist/iconify-icon.js';

	import { session } from '$lib/client/session.svelte';
	import Snacks from '$lib/components/Snacks.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';

	/**
	 * @type {{
	 *  data: import("./$types").LayoutData;
	 *  children: import("svelte").Snippet
	 * }}
	 */
	let { children, data } = $props();

	$effect(() => {
		session.user = data.session.user;
	});
</script>

<Snacks />

<svelte:head>
	<title>epistoshop</title>
</svelte:head>

{@render children()}

<Tooltip />
