import { Piece, Pawn, Knight, Bishop, Rook, Queen, King } from '@/lib/games/chess/pieces';

export interface AllScrobbles {
	[key: string]: Scrobble;
}

export interface FetchInfo {
	user: string;
	from: string;
	to: string;
}

export interface LastFmAlbum {
	'#text': string;
}

export interface LastFmArtist {
	'#text': string;
}

export interface LastFmDate {
	uts: string;
}

export interface LastFmTracks {
	album: LastFmAlbum;
	artist: LastFmArtist;
	date: LastFmDate;
	name: string;
	'@attr': Record<string, boolean>;
}


export interface Scrobble {
	title: string;
	artist: string;
	album: string;
	scrobbleCount: number;
}

export interface ScrobbleCount {
	track: string;
	artist: string;
	album: string;
	scrobbleCount: number;
}

export interface LastFmTrackInfo {
	lastTrackInfo: string;
	scrobbleCounts: ScrobbleCount[];
	totalScrobbles: number;
}

export interface PieceProps {
	color: PieceColor;
	abbreviation: PieceAbbreviation;
	file: number;
	rank: number;
	id: number;
	hasMoved?    : boolean;
}

export type PieceAbbreviation = 'B' | 'K' | 'N' | 'P' | 'Q' | 'R';

export type ColorAndPiece = 'wB' | 'wN' | 'wK' | 'wP' | 'wQ' | 'wR' | 'bB' | 'bN' | 'bK' | 'bP' | 'bQ' | 'bR';

export type PieceColor = 'white' | 'black';

export interface AttackedSquares {
	[key: string]: number[][];
}

export interface AllPieces {
	[key: string]: Piece[];
}

export interface PieceStartingPositions {
	[key: string]: number[][];
}

export interface PieceMapping {
	[key: string]: string;
	// [key: string] : Pawn | Knight | Bishop | Rook | Queen | King,
}

export type PieceType = Pawn | Knight | Bishop | Rook | Queen | King;

export interface SquareClickedEvent {
	square: Piece | null;
	rank: number;
	file: number;
}

export interface MoveParams {
	occupiedSquares: (Piece | null)[][];
	allPieces?: AllPieces;
}

export interface PieceMove {
	piece: Piece;
	rank: number;
	file: number;
}

export interface SquareLocation {
	rank: number;
	file: number;
}

export interface PiecesByType {
	[index: string]: Piece[];
}
