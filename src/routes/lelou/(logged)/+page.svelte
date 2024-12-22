<script>
	import { session } from '$lib/client/session.svelte';
</script>

<h1>Coucou {session.user?.name} !</h1>
