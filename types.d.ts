declare namespace Chess {
	type PieceAbbreviation = 'B' | 'K' | 'N' | 'P' | 'Q' | 'R';

	type PieceColor = 'white' | 'black';

	interface PieceProps {
		color: PieceColor;
		abbreviation: PieceAbbreviation;
		file: number;
		rank: number;
		id: number;
		hasMoved?    : boolean;
	}
}