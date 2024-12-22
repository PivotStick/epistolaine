<script>
	import { api } from '$lib/client/api';
	import { goto, invalidateAll } from '$app/navigation';
	import { snacks } from '$lib/components/Snacks.svelte';
	import { ADMIN_BASE_URL } from '$lib/constants';

	/**
	 * @type {{
	 *  data: import("./$types").PageData
	 * }}
	 */
	let { data } = $props();

	const payload = $state({
		name: '',
		password: ''
	});

	let submitting = $state(false);

	/**
	 * @param {SubmitEvent} e
	 * @param {string} endpoint
	 */
	async function submit(e, endpoint) {
		e.preventDefault();
		submitting = true;

		try {
			const res = await api.action(endpoint, payload);

			document.cookie = 'token=' + res.token;
			await invalidateAll();
			await goto(`/${ADMIN_BASE_URL}`);
		} catch (error) {
			console.error(error);
			// @ts-ignore
			snacks.danger(error.message);
		} finally {
			submitting = false;
		}
	}

	/**
	 * @param {SubmitEvent} e
	 */
	function createAccount(e) {
		return submit(e, '?/createAccount');
	}

	/**
	 * @param {SubmitEvent} e
	 */
	function login(e) {
		return submit(e, '?/login');
	}
</script>

<main>
	{#if data.noAdmins}
		<h1>Ayooo, première connexion on dirait 😎</h1>
		<p>Bon bah créer le compte !</p>
		<p>Parcontre n'oublie surtout pas le mot de passe 😬</p>

		<form onsubmit={createAccount}>
			<input type="text" placeholder="Le nom du compte" bind:value={payload.name} />
			<input
				type="password"
				name="password"
				placeholder="El famoso mot de passe !"
				bind:value={payload.password}
			/>

			<button disabled={!(payload.name && payload.password) || submitting}>
				{#if submitting}
					<iconify-icon icon="fa6-solid:spinner" class="fa-load"></iconify-icon>
				{:else}
					Hopela
					<iconify-icon icon="fa6-solid:paper-plane"></iconify-icon>
				{/if}
			</button>
		</form>
	{:else}
		<h1>Zone sensible !</h1>

		<form onsubmit={login}>
			<input type="text" placeholder="Le nom" bind:value={payload.name} />
			<input type="password" placeholder="Mot de passe" bind:value={payload.password} />

			<button disabled={!(payload.name && payload.password) || submitting}>
				{#if submitting}
					<iconify-icon icon="fa6-solid:spinner" class="fa-load"></iconify-icon>
				{:else}
					Je jure que c'est moi
					<iconify-icon icon="fa6-solid:paper-plane"></iconify-icon>
				{/if}
			</button>
		</form>
	{/if}
</main>

<style lang="scss">
	form,
	main {
		display: grid;
		gap: 1rem;
	}

	main {
		padding: 3rem;
	}
</style>
