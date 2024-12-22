export const ssr = false;

/**
 * @type {import("./$types").LayoutServerLoad}
 */
export async function load({ locals }) {
	return {
		session: {
			user: locals.user
		}
	};
}
