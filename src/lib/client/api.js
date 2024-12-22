import { deserialize } from '$app/forms';

export const api = {
	/**
	 * @param {string} endpoint
	 * @param {any=} payload
	 */
	async action(endpoint, payload) {
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'x-sveltekit-action': 'true'
			},
			body: JSON.stringify(payload)
		});

		const result = deserialize(await response.text());

		switch (result.type) {
			case 'success':
				return result.data ?? {};

			case 'error':
				throw result.error;

			default:
				throw result;
		}
	}
};
