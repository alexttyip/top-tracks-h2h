type SpotifyTokenResponse = {
	access_token: string;
};

type SpotifySearchResultResponse = {
	artists: {
		items: SpotifyArtists[];
	};
};

type SpotifyArtists = {
	id: string;
	name: string;
};
