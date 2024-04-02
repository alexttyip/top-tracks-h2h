import { MongoClient } from 'mongodb';
import { MONGODB_URL } from '$env/static/private';

const client = new MongoClient(MONGODB_URL);

export async function ping() {
	try {
		const database = client.db('sample_mflix');
		const movies = database.collection('movies');

		// Query for a movie that has the title 'Back to the Future'
		const query = { title: 'Back to the Future' };
		const movie = await movies.findOne(query);
		console.log(movie);
	} catch (e) {
		console.error(e);
	}
}
