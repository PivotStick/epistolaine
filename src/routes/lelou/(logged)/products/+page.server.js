import { db } from '$lib/server/db';

/**
 * @type {import("./$types").PageServerLoad}
 */
export async function load() {
	const products = await db.products.find();

	return {
		products
	};
}
