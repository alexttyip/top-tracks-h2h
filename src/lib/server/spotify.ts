import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';

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

export async function getSearchResult(q: string, access_token: string) {
	const res = await fetch(
		'https://api.spotify.com/v1/search?' + new URLSearchParams({ q, type: 'artist' }).toString(),
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		}
	);

	return res.json() as Promise<SpotifySearchResultResponse>;
}
