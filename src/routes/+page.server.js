import { db } from '$lib/server/db';

/**
 * @type {import("./$types").LayoutServerLoad}
 */
export async function load() {
	const products = await db.products.find();

	return {
		products
	};
}
