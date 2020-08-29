import { Piece, Pawn, Knight, Bishop, Rook, Queen, King } from '@/lib/games/chess/pieces';

export interface IAllScrobbles {
	[key: string] : IScrobble,
}

export interface IFetchInfo {
	user : string,
	from : string,
	to   : string,
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

export interface IPieceProps {
	color        : pieceColors,
	abbreviation : pieceAbbreviations,
	file         : number,
	rank         : number,
	id           : number,
	hasMoved?    : boolean
}

export type pieceAbbreviations = 'B' | 'K' | 'N' | 'P' | 'Q' | 'R';

export type pieceColors = 'white' | 'black';

export interface IAttackedSquares {
	[key: string] : Set<number[]>,
}

export interface IAllPieces {
	[key: string] : Piece[],
}

export interface IPieceStartingPositions {
	[key: string] : number[][],
}

export interface IPieceStartingMapping {
	[key: string] : string,
	// [key: string] : Pawn | Knight | Bishop | Rook | Queen | King,
}

export type allPieceTypes = Pawn | Knight | Bishop | Rook | Queen | King;
