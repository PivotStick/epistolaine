import { DB_URL } from '$env/static/private';
import { MongoClient } from 'mongodb';

const client = new MongoClient(DB_URL);
const mdb = client.db('epistolaine');

class Collection {
	#c;

	/**
	 * @param {string} name
	 */
	constructor(name) {
		this.#c = mdb.collection(name);
	}

	/**
	 * @param {import("mongodb").Filter<import("mongodb").Document>=} filters
	 */
	find(filters) {
		const q = filters ? this.#c.find(filters) : this.#c.find();

		return q.toArray();
	}

	/**
	 * @param {import("mongodb").Filter<import("mongodb").Document>=} filters
	 */
	findOne(filters) {
		return filters ? this.#c.findOne(filters) : this.#c.findOne();
	}

	/**
	 * @param {import('mongodb').Document} doc
	 */
	insertOne(doc) {
		return this.#c.insertOne(doc);
	}
}

export const db = {
	users: new Collection('users'),
	products: new Collection('products')
};
