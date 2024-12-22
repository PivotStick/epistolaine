<script>
	import { session } from '$lib/client/session.svelte';
</script>

Heyo {session.user?.name}!
