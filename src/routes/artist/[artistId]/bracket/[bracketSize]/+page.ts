import type { PageLoad } from './$types';

type Seed = SpotifyTrack & {
	seed: number;
};

type MatchUp = {
	higherSeed: Seed;
	lowerSeed?: Seed;
};

const generateBracket = async (tracks: SpotifyTrack[], bracketSize: number) => {
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

export const load: PageLoad = async ({ parent, params }) => {
	const { artistName, artistId, tracksPromise } = await parent();

	const tracks = await tracksPromise;
	const userBracketSize = Number(params.bracketSize);
	const maxNeededBracketSize = Math.pow(2, Math.ceil(Math.log2(tracks.length)));
	const bracketSize = Math.min(maxNeededBracketSize, userBracketSize);

	return {
		artistName,
		artistId,
		bracketSize,
		bracketPromise: generateBracket(tracks, bracketSize)
	};
};
