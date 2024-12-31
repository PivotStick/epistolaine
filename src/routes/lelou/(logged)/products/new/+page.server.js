import { stripe } from '$lib/server/stripe';
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

		await stripe.products.create({
			name: parsed.name,
			description: parsed.description,
			images: [],
			metadata: {
				hidden: 'true',
				closed: 'true'
			},
			default_price_data: {
				currency: 'eur',
				unit_amount: parsed.price * 100
			}
		});
	}
};
