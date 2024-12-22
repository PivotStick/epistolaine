import { ADMIN_BASE_URL } from '$lib/constants';
import { db } from '$lib/server/db';
import { jwt } from '$lib/server/jwt';
import { redirect } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

/**
 * @type {import("@sveltejs/kit").Handle}
 */
export async function handle({ event, resolve }) {
	event.locals.user = null;

	if (event.url.pathname.startsWith(`/${ADMIN_BASE_URL}`)) {
		const token = event.cookies.get('token');
		const result = jwt.verify(token);

		if (result.success) {
			const user = await db.users.findOne({
				_id: new ObjectId(result.payload._id)
			});

			if (user) {
				event.locals.user = {
					_id: user._id.toJSON(),
					name: user.name,
					roles: user.roles
				};
			}
		}

		if (event.url.pathname !== `/${ADMIN_BASE_URL}/auth`) {
			if (!event.locals.user) {
				throw redirect(302, `/${ADMIN_BASE_URL}/auth`);
			}
		} else if (event.locals.user) {
			throw redirect(302, `/${ADMIN_BASE_URL}`);
		}
	}

	return await resolve(event);
}
