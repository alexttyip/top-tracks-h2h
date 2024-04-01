import { getToken, getArtistAlbums, getAlbumTracks, getTracks } from '$lib/server/spotify';
import map from 'lodash/map';
import type { PageServerLoad } from './$types';
import orderBy from 'lodash/orderBy';

export const load: PageServerLoad = async ({ params }) => {
	const artistId = params.slug;

	const accessToken = await getToken();

	const { items: albums } = await getArtistAlbums(artistId, accessToken);

	const trackIds = await getAlbumTracks(map(albums, 'id'), artistId, accessToken);

	const tracks = await getTracks(trackIds, accessToken);

	return {
		tracks: orderBy(tracks, 'popularity', 'desc')
	};
};
