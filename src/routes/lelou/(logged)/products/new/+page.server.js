import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { z } from 'zod';

const schema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	images: z.array(z.string()).min(1),
	price: z.number()
});

/**
 * @type {import('./$types').Actions}
 */
export const actions = {
	async newProduct({ request }) {
		const body = await request.json();
		const parsed = schema.parse(body);

		const result = await db.products.insertOne(parsed);

		if (!result.acknowledged) {
			throw error(500, {
				message:
					"Bon... Une erreur interne à la création du produit ? Il n'a pas réussi à se sauvegarder en base de donnée 🤷"
			});
		}
	}
};
