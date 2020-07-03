const user = 'paul_motz';

const logTracks = async ({ user, from, to }) => {
	const fetchedTracks = await fetchAllTracks({
		user,
		from,
		to,
	});
	const lastTrackInfo = getNewestTrackInfo(fetchedTracks);
	let totalScrobbles = 0;

	const scrobbles = {};

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
				scrobbleCount: 1
			};
		}
	}

	const scrobbleCounts = [];

	for (const scrobble of Object.values(scrobbles)) {
		scrobbleCounts.push({
			track         : scrobble.title, 
			artist        : scrobble.artist, 
			album         : scrobble.album, 
			scrobbleCount : scrobble.scrobbleCount
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

	console.table(scrobbleCounts);
	console.log(totalScrobbles);
	console.log(lastTrackInfo);
};

const fetchAllTracks = async ({user, from, to, limit = 1000} = {}) => {
	const allTracks = await fetchTracks({user, from, to, limit});
	let oldestTrackUts = getOldestTrackUts(allTracks);
	let tracksFound = allTracks.length > 0;

	while (Number(from) <= Number(oldestTrackUts) && tracksFound) {
		const newTracks = await fetchTracks({user, from, to: oldestTrackUts, limit});
		const currentTrackIndex = newTracks.findIndex(track => track['@attr']);
		if (currentTrackIndex !== -1) {
			newTracks.splice(currentTrackIndex, 1)
		}
		allTracks.push(...newTracks);
		oldestTrackUts = getOldestTrackUts(allTracks);
		tracksFound = newTracks.length > 0
	}

	return allTracks;	
};

const fetchTracks = async ({user, from, to, limit = 1000} = {}) => {
	const url = to ?
		`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&limit=${limit}&from=${from}&to=${to}&api_key=7c4429b3e36474312ac2157b5e3bcddf&format=json` :
		`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&limit=${limit}&from=${from}&api_key=7c4429b3e36474312ac2157b5e3bcddf&format=json`;
	const rawData = await fetch(url);
	const data = await rawData.json()
	const tracks = data.recenttracks.track;

	return Array.isArray(tracks) ? tracks : [ tracks ];
};

const getTrack = async (trackName, pagesToSearch = 5) => {
	for (let pageNumber = 1; pageNumber <= pagesToSearch; pageNumber++) {
		const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${user}&api_key=7c4429b3e36474312ac2157b5e3bcddf&page=${pageNumber}&format=json`;
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

const getOldestTrackUts = tracks => {
	return tracks[tracks.length - 1].date.uts;
};

const getNewestTrackInfo = tracks => {
	for (const track of tracks) {
		if (track.date) {
			return `last updated ${getDate(new Date())} - last track UTS: ${track.date.uts} (${track.name} - ${track.artist['#text']})`;
		}
	}
};

const getDate = date => {
	const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];

	return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

// logTracks(1592927031);

export { getTrack, logTracks };

// const dates = [ 1505505307, 1506232862, 1506802762, 1511741570, 1512434635, 1514834830, 1516490975 ];

// last updated Sept 9, 2017
// last updated Sept 16, 2017 - last track UTS: 1505505307
// last updated Sept 24, 2017 - last track UTS: 1506232862
// last updated Oct 1, 2017 - last track UTS: 1506802762
// last updated Oct 29, 2017 - last track UTS: ?
// last updated Nov 19, 2017 - last track UTS: ?
// last updated Nov 26, 2017 - last track UTS: 1511741570
// last updated Dec 5, 2017 - last track UTS: 1512434635
// last updated Jan 1, 2018 - last track UTS: 1514834830
// last updated Jan 20, 2018 - last track UTS: 1516490975
// last updated Feb 11, 2018 - last track UTS: 1518379094
// last updated Apr 1, 2018 - first track UTS: 1519063951, last track UTS: 1518379094 (I've been dead all day - Reasons not to be an Idiot - Feb 19, 2018)
// last updated Apr 1, 2018 - last track UTS: 1522627262
// last updated Apr 7, 2018 - last track UTS: 1523142030 (Knocking At the Door - Arkells)
// last updated Apr 12, 2018 - last track UTS: 1523568178 (Gotta Be Somebody's Blues - Jimmy Eat World)
// last updated May 3, 2018 - last track UTS: 1525391185 (Streamside - The Album Leaf)
// last updated May 18, 2018 - last track UTS: 1526636439 (Bring On The Dancing Horses - Echo & the Bunnymen)
// last updated May 20, 2018 - last track UTS: 1526868788 (Crows - Strung Out)
// last updated June 10, 2018 - last track UTS: 1528673124 (Brothers - The Rural Alberta Advantage)
// last updated June 18, 2018 - last track UTS: 1529362969 (Futures and Sutures - Transit)
// last updated July 2, 2018 - last track UTS: 1530557265 (C'mere - Interpol)
// last updated July 7, 2018 - last track UTS: 1530968192 (Abrasive - Ratatat)
// last updated July 15, 2018 - last track UTS: 1531668963 (Far Behind - Eddie Vedder)
// last updated July 17, 2018 - last track UTS: 1531873313 (Right Choice - Can't Swim)
// last updated July 22, 2018 - last track UTS: 1532305986 (Forget Me Not - Brian Fallon)
// last updated July 28, 2018 - last track UTS: 1532802878 (Direct Hit! - Buried Alive)
// last updated August 2, 2018 - last track UTS: 1533234945 (Finale (feat. Nicholas Petricca) - Madeon)
// last updated August 6, 2018 - last track UTS: 1533596481 (Sweetwater - Ramin Djawadi)
// last updated August 8, 2018 - last track UTS: 1533759430 (Zephyr - Madeon)
// last updated August 11, 2018 - last track UTS: 1534031244 (Oversized - Basement)
// last updated August 18, 2018 - last track UTS: 1534604230 (House On Fire - Rise Against)
// last updated September 3, 2018 - last track UTS: 1536002507 (I'm an Outlaw - Kurt Vile)*
// last updated September 9, 2018 - last track UTS: 1536459254 (Gum - Moose Blood)*
// last updated September 16, 2018 - last track UTS: 1537065489 (Outside the Realm - Big Giant Circles)
// last updated September 24, 2018 - last track UTS: 1537820351 (Tellin' Lies - The Menzingers)
// last updated September 29, 2018 - last track UTS: 1538146575 (Midnight Hands - Rise Against)
// last updated October 8, 2018 - last track UTS: 1539013342 (Drugs or Me - Jimmy Eat World)
// last updated October 21, 2018 - last track UTS: 1540170721 (Þú ert jörðin - Ólafur Arnalds)
// last updated November 11, 2018 - last track UTS: 1541868126 (Charm Assault - Ride)
// last updated December 2, 2018 - last track UTS: 1543712302 (Lionhearted - Porter Robinson)
// last updated December 9, 2018 - last track UTS: 1544378503 (Death To All But Metal - Steel Panther)
// last updated December 28, 2018 - last track UTS: 1546018982 (Coffee Eyes - The Wonder Years)
// last updated January 6, 2019 - last track UTS: 1546721445 (After the Love Has Gone - Earth, Wind & Fire)
// last updated January 13, 2019 - last track UTS: 1547338197 (Pro Memoria - Ghost)
// last updated January 26, 2019 - last track UTS: 1548435794 (World On Fire - The Royal Concept)
// last updated February 19, 2019 - last track UTS: 1550611877 (California Snow (From the Motion Picture "Spell") - Weezer)
// last updated March 9, 2019 - last track UTS: 1552150522 (Sinner - Deaf Havana)
// last updated March 11, 2019 - last track UTS: 1552329868 (In the Middle of It All - Citizen)
// last updated March 23, 2019 - last track UTS: 1553295453 (No Way - Stripped - The Naked and Famous)
// last updated April 14, 2019 - last track UTS: 1555256980 (Complicated - Avril Lavigne)
// last updated May 1, 2019 - last track UTS: 1556743166 (Over My Head (Cable Car) - A Day to Remember)
// last updated May 20, 2019 - last track UTS: 1558367370 (The Real Damage - Frank Turner)
// last updated May 30, 2019 - last track UTS: 1559244014 (Signaling Through The Flames - The American Dollar)
// last updated July 4, 2019 - last track UTS: 1562270765 (Acquiesce - Remastered - Oasis)
// last updated July 13, 2019 - last track UTS: 1563065597 (Punk Rock Princess - Something Corporate)
// last updated July 21, 2019 - last track UTS: 1563724836 (Kill - Jimmy Eat World)
// last updated July 28, 2019 - last track UTS: 1564335801 (Going up the Country - Canned Heat)
// last updated August 5, 2019 - last track UTS: 1565028309 (Settle Down - The 1975)
// last updated August 11, 2019 - last track UTS: 1565553898 (The Rubberband Man - The Spinners)
// last updated August 18, 2019 - last track UTS: 1566139517 (Night Drive - Jimmy Eat World)
// last updated August 25, 2019 - last track UTS: 1566757721 (Clarity - Hammock)
// last updated September 2, 2019 - last track UTS: 1567471228 (Runnin' Toward the Light - Aaron West and The Roaring Twenties)
// last updated September 8, 2019 - last track UTS: 1567986573 (I Just Can't Wait to Be King - JD McCrary)
// last updated September 15, 2019 - last track UTS: 1568568207 (The Motherload - Mastodon)
// last updated September 22, 2019 - last track UTS: 1569184829 (Undone - The Sweater Song - Weezer)
// last updated September 29, 2019 - last track UTS: 1569808209 (Fashion - The Royal Concept)
// last updated October 6, 2019 - last track UTS: 1570377153 (Cream on Chrome - Ratatat)
// last updated October 16, 2019 - last track UTS: 1571266715 (Þú ert jörðin - Ólafur Arnalds)
// last updated October 20, 2019 - last track UTS: 1571608006 (Till Death - Japanese Breakfast)
// last updated October 27, 2019 - last track UTS: 1572201838 (View from Heaven - Yellowcard)
// last updated November 3, 2019 - last track UTS: 1572802406 (Flaming Red Hair - Howard Shore)
// last updated November 10, 2019 - last track UTS: 1573431100 (Black Treacle - Arctic Monkeys)
// last updated November 17, 2019 - last track UTS: 1574037824 (Voices Off Camera - Ghost Note Symphonies - Rise Against)
// last updated November 24, 2019 - last track UTS: 1574639006 (Immunity - Jon Hopkins)
// last updated December 8, 2019 - last track UTS: 1575828804 (Anklebiters - Paramore)
// last updated December 15, 2019 - last track UTS: 1576426581 (Light a Fire (Fight a Liar) - Jakub Zytecki)
// last updated January 5, 2020 - last track UTS: 1578274101 (Lovers - Anna of the North)
// last updated January 13, 2020 - last track UTS: 1578968078 (Waking / Waterskier - Michael Brook)
// last updated January 21, 2020 - last track UTS: 1579655821 (Road Head - Japanese Breakfast)
// last updated February 2, 2020 - last track UTS: 1580680850 (Some Things Never Change - Kristen Bell)
// last updated February 7, 2020 - last track UTS: 1581095509 (Empty Space - The Story So Far)
// last updated February 8, 2020 - last track UTS: 1581184002 (6/10 - dodie)
// last updated February 24, 2020 - last track UTS: 1582595003 (Growing on You - The Story So Far)
// last updated March 1, 2020 - last track UTS: 1583098119 (Nemo Egg (Main Title) - Thomas Newman)
// last updated March 8, 2020 - last track UTS: 1583699604 (Substitute - Frank Turner)
// last updated March 15, 2020 - last track UTS: 1584316702 (Le Freak - Chic)
// last updated March 22, 2020 - last track UTS: 1584897261 (Your Hand in Mine - Explosions in the Sky)
// last updated March 30, 2020 - last track UTS: 1585597447 (California - blink-182)
// last updated April 5, 2020 - last track UTS: 1586105458 (Paperman - Christophe Beck)
// last updated April 14, 2020 - last track UTS: 1586911934 (The Mighty Rio Grande - This Will Destroy You)
// last updated April 19, 2020 - last track UTS: 1587327235 (Covet - Basement)
// last updated April 26, 2020 - last track UTS: 1587930025 (If It Means a Lot to You - A Day to Remember)
// last updated May 1, 2020 - last track UTS: 1588299418 (Crush - Polyphia)
// last updated May 7, 2020 - last track UTS: 1588893891 (Two Days - Aviations)
// last updated May 24, 2020 - last track UTS: 1590359910 (Baby Driver - Simon & Garfunkel)
// last updated June 23, 2020 - last track UTS: 1592927031 (Laid Low - The Naked and Famous)
