import { AllScrobbles, FetchInfo, LastFmTracks, ScrobbleCount, LastFmTrackInfo } from './types';

const USER = 'paul_motz';
const API_KEY = process.env.VUE_APP_LASTFM_API_KEY;

const getOldestTrackUts = (tracks: Array<LastFmTracks>): string => {
	// If there is currently a track being scrobbled and it is the only track returned
	// it will not have a date property.
	return tracks[tracks.length - 1].date ? tracks[tracks.length - 1].date.uts : '';
};

const fetchTracks = async ({ user = USER, from = '', to = '', limit = 1000 } = {} ): Promise<LastFmTracks[]> => {
	const url = to ?
		`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&limit=${limit}&from=${from}&to=${to}&api_key=${API_KEY}&format=json` :
		`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&limit=${limit}&from=${from}&api_key=${API_KEY}&format=json`;
	const rawData = await fetch(url);
	const data = await rawData.json();
	const tracks = data.recenttracks.track;

	return Array.isArray(tracks) ? tracks : [ tracks ];
};

const fetchAllTracks = async ({user = USER, from = '', to = '', limit = 1000} = {}): Promise<LastFmTracks[]> => {
	const allTracks = await fetchTracks({user, from, to, limit});

	if (allTracks.length === 0) {
		return [];
	}

	let oldestTrackUts = getOldestTrackUts(allTracks);
	let tracksFound = allTracks.length > 0;

	while (Number(from) <= Number(oldestTrackUts) && tracksFound) {
		const newTracks = await fetchTracks({user, from, to : oldestTrackUts, limit});
		const currentTrackIndex = newTracks.findIndex(track => track['@attr']);
		if (currentTrackIndex !== -1) {
			newTracks.splice(currentTrackIndex, 1);
		}
		allTracks.push(...newTracks);
		oldestTrackUts = getOldestTrackUts(allTracks);
		tracksFound = newTracks.length > 0;
	}

	return allTracks;	
};

const getDate = (date: Date): string => {
	const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December',
	];

	return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

const getLastTrackInfo = (tracks: Array<LastFmTracks>): string => {
	for (const track of tracks) {
		if (track.date) {
			return `last updated ${getDate(new Date())} - last track UTS: ${track.date.uts} (${track.name} - ${track.artist['#text']})`;
		}
	}

	return '';
};


const getTracks = async ({ user, apiKey, from, to }: FetchInfo): Promise<LastFmTrackInfo> => {
	const fetchedTracks: Array<LastFmTracks> = await fetchAllTracks({
		user,
		from,
		to,
	});

	if (fetchedTracks.length === 0) {
		return {
			lastTrackInfo  : '',
			scrobbleCounts : [],
			totalScrobbles : 0,
		};
	}

	const lastTrackInfo = getLastTrackInfo(fetchedTracks);
	const scrobbleCounts: Array<ScrobbleCount> = [];
	let totalScrobbles = 0;

	const scrobbles: AllScrobbles = {};

	for (const track of fetchedTracks) {
		const title = track.name;
		const artist = track.artist['#text'];
		const album = track.album['#text'];
		const key = `${title} - ${artist}`;
		totalScrobbles++;
		if (scrobbles[key]) {
			scrobbles[key].scrobbleCount++;
		} else {
			scrobbles[key] = {
				title,
				artist,
				album,
				scrobbleCount : 1,
			};
		}
	}

	for (const scrobble of Object.values(scrobbles)) {
		scrobbleCounts.push({
			track         : scrobble.title,
			artist        : scrobble.artist,
			album         : scrobble.album,
			scrobbleCount : scrobble.scrobbleCount,
		});
	}

	scrobbleCounts.sort((a, b) => {
		if (a.artist < b.artist) return -1;
		if (a.artist > b.artist) return 1;
		if (a.album < b.album) return -1;
		if (a.album > b.album) return 1;
		if (a.scrobbleCount < b.scrobbleCount) return -1;
		if (a.scrobbleCount > b.scrobbleCount) return 1;
		return 0;
	});

	// eslint-disable no-console
	console.table(scrobbleCounts);
	console.log(totalScrobbles);
	console.log(lastTrackInfo);

	return {
		lastTrackInfo,
		scrobbleCounts,
		totalScrobbles,
	};
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getTrack = async (trackName: string, pagesToSearch = 5): Promise<void> => {
	for (let pageNumber = 1; pageNumber <= pagesToSearch; pageNumber++) {
		const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${USER}&api_key=${API_KEY}&page=${pageNumber}&format=json`;
		const rawData = await fetch(url);
		const data = await rawData.json();

		const tracks = data.toptracks.track;
		for (const track of tracks) {
			if (track.name === trackName) {
				return;
			}
		}
	}
	console.log(`Could not find track: ${trackName}`);
};

export { getTracks };
