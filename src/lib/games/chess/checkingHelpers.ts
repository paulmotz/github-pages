import { PieceColor, SquareLocation, PiecesByType } from '@/lib/types';
// import { PiecesByType } from '@/lib/games/chess/helpers';
// import { pieceConstructors } from '@/lib/games/chess/setupHelpers';
import { Piece, King } from '@/lib/games/chess/pieces';

export const getKingLocation = (allPieces: PiecesByType, color: PieceColor): SquareLocation => {
	const [ king ] = allPieces[`${color[0]}K`];
	return {
		rank : king.rank,
		file : king.file,
	};
};

export const getCheckingPieces = (
	allPieces: PiecesByType,
	occupiedSquares: (Piece | null)[][],
	color: PieceColor,
): Piece[] => {
	const checkingPieces: Piece[] = [];
	const kingLocation = getKingLocation(allPieces, color);

	for (const pieceTypeAndColor in allPieces) {
		for (const piece of allPieces[pieceTypeAndColor]) {
			if (!(piece instanceof King) && piece.color !== color) {
				if (piece.protectedSquares(occupiedSquares).find(square =>
					square[0] === kingLocation.rank && square[1] === kingLocation.file,
				)) {
					checkingPieces.push(piece);
				}
			}
		}
	}

	return checkingPieces;
};