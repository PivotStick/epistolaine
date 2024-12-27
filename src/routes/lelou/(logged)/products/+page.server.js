import { db } from '$lib/server/db';

/**
 * @type {import("./$types").PageServerLoad}
 */
export async function load() {
	const products = await db.products.find();

	return {
		products: products.map((p) => ({
			_id: p._id.toJSON(),
			name: p.name,
			images: p.images,
			description: p.description,
			price: p.price
		}))
	};
}
