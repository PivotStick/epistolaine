import { db } from '$lib/server/db';

/**
 * @type {import("./$types").LayoutServerLoad}
 */
export async function load() {
	const items = await db.items.find();

	return {
		items
	};
}
