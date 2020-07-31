import { IAllScrobbles, IFetchInfo, ILastFmTracks, IScrobbleCount } from './types';

const USER = 'paul_motz';

const getTracks = async ({ user, from, to }: IFetchInfo) => {
	const fetchedTracks: Array<ILastFmTracks> = await fetchAllTracks({
		user,
		from,
		to,
	});

	if (fetchedTracks.length === 0) {
		return {
			newestTrackInfo : '',
			scrobbleCounts  : [],
			totalScrobbles  : 0,
		};
	}

	const newestTrackInfo = getNewestTrackInfo(fetchedTracks);
	const scrobbleCounts: Array<IScrobbleCount> = [];
	let totalScrobbles = 0;

	const scrobbles: IAllScrobbles = {};

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
	console.log(newestTrackInfo);

	return {
		newestTrackInfo,
		scrobbleCounts,
		totalScrobbles,
	};
};

const fetchAllTracks = async ({user = USER, from = '', to = '', limit = 1000} = {}) => {
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

const fetchTracks = async ({ user = USER, from = '', to = '', limit = 1000 } = {} ) => {
	const url = to ?
		`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&limit=${limit}&from=${from}&to=${to}&api_key=7c4429b3e36474312ac2157b5e3bcddf&format=json` :
		`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&limit=${limit}&from=${from}&api_key=7c4429b3e36474312ac2157b5e3bcddf&format=json`;
	const rawData = await fetch(url);
	const data = await rawData.json();
	const tracks = data.recenttracks.track;

	return Array.isArray(tracks) ? tracks : [ tracks ];
};

const getTrack = async (trackName: string, pagesToSearch = 5) => {
	for (let pageNumber = 1; pageNumber <= pagesToSearch; pageNumber++) {
		const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${USER}&api_key=7c4429b3e36474312ac2157b5e3bcddf&page=${pageNumber}&format=json`;
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

const getOldestTrackUts = (tracks: Array<ILastFmTracks>) => {
	// If there is currently a track being scrobbled and it is the only track returned
	// it will not have a date property.
	return tracks[tracks.length - 1].date && tracks[tracks.length - 1].date.uts;
};

const getNewestTrackInfo = (tracks: Array<ILastFmTracks>) => {
	for (const track of tracks) {
		if (track.date) {
			return `last updated ${getDate(new Date())} - last track UTS: ${track.date.uts} (${track.name} - ${track.artist['#text']})`;
		}
	}
};

const getDate = (date: Date) => {
	const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December',
	];

	return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export { getTracks };
