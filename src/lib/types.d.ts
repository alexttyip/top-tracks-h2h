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

type SpotifyArtistAlbums = {
	items: {
		id: string;
		name: string;
		href: string;
	}[];
};

type SpotifyAlbums = {
	albums: SpotifyAlbum[];
};

type SpotifyAlbum = {
	tracks: {
		items: {
			artists: {
				id: string;
			}[];
			id: string;
		}[];
	};
};

type SpotifyTracks = {
	tracks: SpotifyTrack[];
};

type SpotifyTrack = {
	id: string;
	name: string;
	popularity: number;
};
