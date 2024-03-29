import { AllScrobbles, FetchInfo, LastFmTracks, ScrobbleCount, LastFmTrackInfo } from './types';

const getOldestTrackUts = (tracks: Array<LastFmTracks>): string => {
	// If there is currently a track being scrobbled and it is the only track returned
	// it will not have a date property.
	return tracks[tracks.length - 1].date ? tracks[tracks.length - 1].date.uts : '';
};

const fetchTracks = async ({ user = '', apiKey = '', from = '', to = '', limit = 1000 } = {} ): Promise<LastFmTracks[]> => {
	const url = to ?
		`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&limit=${limit}&from=${from}&to=${to}&api_key=${apiKey}&format=json` :
		`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&limit=${limit}&from=${from}&api_key=${apiKey}&format=json`;
	const rawData = await fetch(url);
	const data = await rawData.json();
	const tracks: LastFmTracks[] = data.recenttracks.track;

	if (!tracks.length) {
		return [];
	}

	const currentTrackIndex = tracks.findIndex(track => track['@attr']);
	if (currentTrackIndex !== -1) {
		tracks.splice(currentTrackIndex, 1);
	}

	return Array.isArray(tracks) ? tracks : [ tracks ];
};

const fetchAllTracks = async ({user = '', apiKey = '', from = '', to = '', limit = 1000} = {}): Promise<LastFmTracks[]> => {
	const allTracks = await fetchTracks({user, apiKey, from, to, limit});

	if (allTracks.length === 0) {
		return [];
	}

	let oldestTrackUts = getOldestTrackUts(allTracks);

	while (Number(from) <= Number(oldestTrackUts) && allTracks.length >= limit) {
		const newTracks = await fetchTracks({user, apiKey, from, to : oldestTrackUts, limit});
		if (newTracks.length === 0) {
			break;
		}
		allTracks.push(...newTracks);
		oldestTrackUts = getOldestTrackUts(allTracks);
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
		apiKey,
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
		const key = `${title} - ${artist} - ${album}`;
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
const getTrack = async (user: string, apiKey: string, trackName: string, pagesToSearch = 5): Promise<void> => {
	for (let pageNumber = 1; pageNumber <= pagesToSearch; pageNumber++) {
		const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${user}&api_key=${apiKey}&page=${pageNumber}&format=json`;
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
