import { db } from '$lib/server/db';
import { jwt } from '$lib/server/jwt';
import { password } from '$lib/server/password';
import { wait } from '$lib/utils/wait';
import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

/**
 * @type {import("./$types").PageServerLoad}
 */
export async function load() {
	const admins = await db.users.find({
		roles: 'admin'
	});

	return {
		noAdmins: admins.length === 0
	};
}

/**
 * @type {import("./$types").Actions}
 */
export const actions = {
	async createAccount({ request }) {
		const admins = await db.users.find({
			roles: 'admin'
		});

		if (admins.length) return;

		const data = await request.json();
		const _id = new ObjectId();

		const result = await db.users.insertOne({
			_id,
			roles: ['admin'],
			name: data.name,
			password: await password.hash(data.password)
		});

		if (!result.acknowledged)
			throw error(500, {
				message: 'Something went wrong while creating account'
			});

		return {
			token: jwt.sign({
				_id: _id.toJSON()
			})
		};
	},

	async login({ request }) {
		const body = await request.json();
		const admin = await db.users.findOne({
			roles: 'admin',
			name: body.name
		});

		if (!admin) {
			await wait();
			throw error(400, {
				message: 'Bad credentials'
			});
		}

		const valid = await password.verify(admin.password, body.password);

		if (!valid) {
			await wait();
			throw error(400, {
				message: 'Bad credentials'
			});
		}

		return {
			token: jwt.sign({
				_id: admin._id.toJSON()
			})
		};
	}
};
