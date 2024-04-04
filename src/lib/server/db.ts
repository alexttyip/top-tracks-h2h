import { MONGODB_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(MONGODB_URL);

const DB_NAME = 'TOP_TRACKS_H2H';

export async function createTournamentAndReturnId(
	artistId: string,
	trackIds: string[],
	bracketSize: number
) {
	try {
		const database = client.db(DB_NAME);
		const { insertedId } = await database.collection('tournaments').insertOne({
			artistId,
			trackIds,
			bracketSize
		});

		return insertedId.toString();
	} catch (e) {
		console.error(e);
		error(500, {
			message: 'Error creating tournament'
		});
	}
}

export async function fetchTournament(tournamentId: string) {
	try {
		const database = client.db(DB_NAME);
		return database.collection<DbTournament>('tournaments').findOne(new ObjectId(tournamentId));
	} catch (e) {
		console.error(e);
		error(500, {
			message: 'Error fetching tournament'
		});
	}
}
