import { createTournamentAndReturnId } from '$lib/server/db';
import {
	getAlbumTracks,
	getArtistAlbums,
	getArtistName,
	getToken,
	getTracks
} from '$lib/server/spotify';
import { fail, redirect } from '@sveltejs/kit';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import type { Actions, PageServerLoad } from './$types';

const getAllTracksOfArtist = async (artistId: string, accessToken: string) => {
	const { items: albums } = await getArtistAlbums(artistId, accessToken);

	const trackIds = await getAlbumTracks(map(albums, 'id'), artistId, accessToken);

	const tracks = await getTracks(trackIds, accessToken);

	return orderBy(tracks, 'popularity', 'desc');
};

export const load: PageServerLoad = async ({ params }) => {
	const { artistId } = params;

	const accessToken = await getToken();

	return {
		artistId,
		artistName: (await getArtistName(artistId, accessToken)).name,
		tracksPromise: getAllTracksOfArtist(artistId, accessToken)
	};
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const bracketSize = data.get('bracketSize');
		const artistId = data.get('artistId');
		const tracks = data.get('tracks');

		if (!bracketSize || bracketSize === 'undefined' || bracketSize instanceof File) {
			return fail(400, { missing: true });
		}

		if (!artistId || !tracks || artistId instanceof File || tracks instanceof File) {
			return fail(500);
		}

		const tournamentId = await createTournamentAndReturnId(
			artistId,
			tracks.split(',').splice(0, Number(bracketSize)),
			Number(bracketSize)
		);

		return redirect(303, `/tournament/${tournamentId}`);
	}
} satisfies Actions;
