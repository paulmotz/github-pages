export interface IAllScrobbles {
	[key: string] : IScrobble,
}

export interface IFetchInfo {
	user: string,
	from: string,
	to: string,
}

export interface ILastFmAlbum {
	'#text' : string
}

export interface ILastFmArtist {
	'#text' : string
}

export interface ILastFmDate {
	uts : string
}

export interface ILastFmTracks {
	album  : ILastFmAlbum,
	artist : ILastFmArtist,
	date   : ILastFmDate,
	name   : string,
}


export interface IScrobble {
	title         : string,
	artist        : string,
	album         : string,
	scrobbleCount : number,
}

export interface IScrobbleCount {
	track         : string,
	artist        : string,
	album         : string,
	scrobbleCount : number,
}
