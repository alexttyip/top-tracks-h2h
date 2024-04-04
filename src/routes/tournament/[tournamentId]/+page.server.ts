import { fetchTournament } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getArtistName, getToken, getTracks } from '$lib/server/spotify';

type Seed = SpotifyTrack & {
	seed: number;
};

type MatchUp = {
	higherSeed: Seed;
	lowerSeed?: Seed;
};

const generateBracket = (tracks: SpotifyTrack[], bracketSize: number) => {
	const bracket: MatchUp[] = [];

	for (let i = 0; i < bracketSize / 2; i++) {
		const higherSeed = tracks[i];
		const lowerSeed = tracks[bracketSize - i - 1];

		if (!higherSeed) {
			// TODO does this happen?
			break;
		}

		if (!lowerSeed) {
			// Bye

			bracket.push({
				higherSeed: {
					...higherSeed,
					seed: i
				}
			});
			continue;
		}

		bracket.push({
			higherSeed: {
				...higherSeed,
				seed: i
			},
			lowerSeed: {
				...lowerSeed,
				seed: bracketSize - i - 1
			}
		});
	}

	return bracket;
};

export const load: PageServerLoad = async ({ params }) => {
	const { tournamentId } = params;

	const {
		artistId,
		trackIds,
		bracketSize: userBracketSize
	} = (await fetchTournament(tournamentId)) ?? error(404, { message: 'Tournament not found' });

	const accessToken = await getToken();

	const artistName = await getArtistName(artistId, accessToken);
	const tracks = await getTracks(trackIds, accessToken);

	const maxNeededBracketSize = Math.pow(2, Math.ceil(Math.log2(tracks.length)));
	const bracketSize = Math.min(maxNeededBracketSize, userBracketSize);

	return {
		bracketSize,
		artistName,
		artistId,
		bracketPromise: generateBracket(tracks, bracketSize)
	};
};
