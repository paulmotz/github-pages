import { PieceColor, PiecesByType } from '@/lib/types';
import { getCheckingPieces} from '@/lib/games/chess/checkingHelpers';
import { Piece } from '@/lib/games/chess/pieces';

export const isStalemate = (allPieces: PiecesByType, occupiedSquares: (Piece | null)[][], color: PieceColor): boolean => {
	const checkingPieces = getCheckingPieces(allPieces, occupiedSquares, color);

	if (checkingPieces.length !== 0) {
		return false;
	}
	
	for (const pieceType in allPieces) {
		if (pieceType[0] === color[0]) {
			for (const piece of allPieces[pieceType]) {
				if (piece.moves({ allPieces, occupiedSquares }).length > 0) {
					return false;
				}
			}
		}
	}

	return true;
};

export const hasMajorPieces = (allPieces: PiecesByType): boolean => {
	const majorPieceAbbrevations = [ 'bQ', 'bR', 'wQ', 'wR' ];
	return majorPieceAbbrevations.some(pieceType => allPieces[pieceType] && allPieces[pieceType].length > 0);
};

export const hasPawns = (allPieces: PiecesByType): boolean => {
	const pawns = [ 'bP', 'wP' ];
	return pawns.some(pieceType => allPieces[pieceType] && allPieces[pieceType].length > 0);
};

export const hasDifferentColorSquarePieces = (pieces: Piece[]): boolean => {
	const originalSquareColor = (pieces[0].rank + pieces[0].file) % 2;

	for (let i = 1; i < pieces.length; i++) {
		if (originalSquareColor !== (pieces[i].rank + pieces[i].file) % 2) {
			return true;
		}
	}

	return false;
};

export const hasSufficientBishops = (allPieces: PiecesByType): boolean => {
	const bishops = [ 'bB', 'wB' ];
	return bishops.some(pieceType => allPieces[pieceType] && allPieces[pieceType].length > 1 && hasDifferentColorSquarePieces(allPieces[pieceType]));
};

export const hasKnightAndBishop = (allPieces: PiecesByType): boolean => {
	const colors = [ 'b', 'w' ];
	return colors.some(color => allPieces[`${color}B`] && allPieces[`${color}B`].length > 0
		&& allPieces[`${color}N`] && allPieces[`${color}N`].length > 0);
};

export const hasInsufficientMatingMaterial = (allPieces: PiecesByType): boolean => {
	return !(hasMajorPieces(allPieces) 
		|| hasPawns(allPieces) 
		|| hasSufficientBishops(allPieces)
		|| hasKnightAndBishop(allPieces));
};
