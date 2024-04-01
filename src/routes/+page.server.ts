import { getToken, getSearchResult } from '$lib/server/spotify';
import type { PageServerLoad } from './$types';

const searchForArtists = async (query: string): Promise<SpotifyArtists[]> => {
	const accessToken = await getToken();

	const result = await getSearchResult(query, accessToken);

	return result.artists.items;
};

export const load: PageServerLoad = ({ url }) => {
	const query = url.searchParams.get('q');

	if (!query) {
		return {
			query
		};
	}

	return {
		query,
		artistsPromise: searchForArtists(query)
	};
};
