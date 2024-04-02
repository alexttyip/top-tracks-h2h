import {
	getAlbumTracks,
	getArtistAlbums,
	getArtistName,
	getToken,
	getTracks
} from '$lib/server/spotify';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import type { LayoutServerLoad } from './$types';

const getAllTracksOfArtist = async (artistId: string, accessToken: string) => {
	const { items: albums } = await getArtistAlbums(artistId, accessToken);

	const trackIds = await getAlbumTracks(map(albums, 'id'), artistId, accessToken);

	const tracks = await getTracks(trackIds, accessToken);

	return orderBy(tracks, 'popularity', 'desc');
};

export const load: LayoutServerLoad = async ({ params }) => {
	const { artistId } = params;

	const accessToken = await getToken();

	return {
		artistId,
		artistName: (await getArtistName(artistId, accessToken)).name,
		tracksPromise: getAllTracksOfArtist(artistId, accessToken)
	};
};
