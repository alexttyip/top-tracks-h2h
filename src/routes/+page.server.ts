import { getToken, getSearchResult } from '$lib/server/spotify';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get('q');

	if (!query) {
		return;
	}

	const accessToken = await getToken();

	const result = await getSearchResult(query, accessToken);

	console.log(JSON.stringify(result.artists.items[0], null, 2));

	const artists: SpotifyArtists[] = result.artists.items.map(({ name, id }) => ({
		name,
		id
	}));

	return {
		query,
		result: artists
	};
};
