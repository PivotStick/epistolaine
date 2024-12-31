import { deserialize } from '$app/forms';
import { goto } from '$app/navigation';

export const api = {
	/**
	 * @param {string} endpoint
	 * @param {any=} payload
	 * @param {{ redirect?: "internal" | "external" }=} options
	 */
	async action(endpoint, payload, options = {}) {
		options.redirect ??= 'internal';

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

			case 'failure':
				throw result.data;

			case 'redirect':
				if (options.redirect === 'external') {
					window.open(result.location);
				} else {
					const url = new URL(result.location);
					if (url.origin === window.location.origin) {
						await goto(url);
					} else {
						window.location.assign(url);
					}
				}
				break;

			default:
				// @ts-ignore
				throw new Error(`Unhandled result type: "${result.type}"`);
		}
	}
};
