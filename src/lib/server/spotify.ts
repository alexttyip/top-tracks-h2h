import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';

function getDefaultSpotifyFetchParam(accessToken: string) {
	return {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	};
}

export async function getToken() {
	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		body: new URLSearchParams({
			grant_type: 'client_credentials'
		}),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization:
				'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')
		}
	});

	const { access_token } = (await response.json()) as SpotifyTokenResponse;
	return access_token;
}

export async function getSearchResult(q: string, accessToken: string) {
	const res = await fetch(
		'https://api.spotify.com/v1/search?' +
			new URLSearchParams({ q, type: 'artist', limit: '50' }).toString(),
		getDefaultSpotifyFetchParam(accessToken)
	);

	return res.json() as Promise<SpotifySearchResultResponse>;
}

export async function getArtistAlbums(artistId: string, accessToken: string) {
	const params = new URLSearchParams({
		limit: '50',
		market: 'GB'
	}).toString();

	const res = await fetch(
		`https://api.spotify.com/v1/artists/${artistId}/albums?${params}`,
		getDefaultSpotifyFetchParam(accessToken)
	);

	return res.json() as Promise<SpotifyArtistAlbums>;
}

export async function getAlbumTracks(albumIds: string[], artistId: string, accessToken: string) {
	const promises = [];

	for (let i = 0; i <= Math.floor(albumIds.length / 20); i++) {
		const params = new URLSearchParams({
			ids: albumIds.slice(i * 20, (i + 1) * 20).join(','),
			market: 'GB'
		}).toString();

		promises.push(
			fetch(`https://api.spotify.com/v1/albums?${params}`, getDefaultSpotifyFetchParam(accessToken))
				.then((res) => res.json() as Promise<SpotifyAlbums>)
				.then(({ albums }) => albums.flatMap(({ tracks }) => tracks.items))
		);
	}

	const tracks = (await Promise.all(promises)).flat();

	return tracks
		.filter(({ artists }) => artists.some(({ id }) => id === artistId))
		.map(({ id }) => id);
}

export async function getTracks(trackIds: string[], accessToken: string) {
	const promises = [];

	const maxIdPerRequest = 50;

	for (let i = 0; i <= Math.floor(trackIds.length / maxIdPerRequest); i++) {
		const params = new URLSearchParams({
			ids: trackIds.slice(i * maxIdPerRequest, (i + 1) * maxIdPerRequest).join(','),
			market: 'GB'
		}).toString();

		promises.push(
			fetch(`https://api.spotify.com/v1/tracks?${params}`, getDefaultSpotifyFetchParam(accessToken))
				.then((res) => res.json() as Promise<SpotifyTracks>)
				.then(({ tracks }) => tracks)
		);
	}

	return (await Promise.all(promises)).flat();
}
