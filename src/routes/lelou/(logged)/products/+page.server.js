import { stripe } from '$lib/server/stripe';
import { error } from '@sveltejs/kit';

/**
 * @type {import("./$types").PageServerLoad}
 */
export async function load() {
	const products = await stripe.products.list({
		expand: ['data.default_price']
	});

	return {
		products: products.data.map((p) => ({
			id: p.id,
			name: p.name,
			images: p.images,
			description: p.description,
			price: p && typeof p.default_price === 'object' ? (p.default_price?.unit_amount ?? 0) : 0,

			hidden: p.metadata.hidden === 'true',
			closed: p.metadata.closed === 'true'
		}))
	};
}

/**
 * @type {import("./$types").Actions}
 */
export const actions = {
	async deleteOne({ request }) {
		const { productID } = await request.json();
		await stripe.products.del(productID);
	},

	async toggleMeta({ request }) {
		const { productID, prop } = await request.json();

		if (prop !== 'hidden' && prop !== 'closed') {
			throw error(400, { message: 'Mauvaise prop !' });
		}

		const product = await stripe.products.retrieve(productID);

		if (!product) {
			throw error(404, { message: "Ce produit n'a pas été trouvé !" });
		}

		const value = product.metadata[prop] === 'true';

		await stripe.products.update(productID, {
			metadata: {
				[prop]: String(!value)
			}
		});
	}
};
