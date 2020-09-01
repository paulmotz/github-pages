import { PieceColor, SquareLocation, PiecesByType } from '@/lib/types';
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

export const getCheckingPath = (checkingPieceLocation: SquareLocation, kingLocation: SquareLocation): number[][] => {
	const rankDifference = kingLocation.rank - checkingPieceLocation.rank;
	const fileDifference = kingLocation.file - checkingPieceLocation.file;

	const absoluteRankDifference = Math.abs(rankDifference);
	const absoluteFileDifference = Math.abs(fileDifference);

	if (absoluteRankDifference !== 0 && absoluteFileDifference !== 0 && absoluteRankDifference / absoluteFileDifference !== 1) {
		throw new Error('invalid check path');
	}

	const checkDistance = Math.max(absoluteRankDifference, absoluteFileDifference);

	const checkDirection = {
		rank : rankDifference / checkDistance,
		file : fileDifference / checkDistance,
	};

	const path = [];
	let pathRank = checkingPieceLocation.rank;
	let pathFile = checkingPieceLocation.file;

	for (let i = 1; i < checkDistance; i++) {
		pathRank += checkDirection.rank;
		pathFile += checkDirection.file;
		path.push([ pathRank, pathFile ]);
	}

	return path;
};

export const isSquareAttacked = (square: number[], attackedSquares: number[][]): boolean => {
	return !!attackedSquares.find(attackedSquare => attackedSquare[0] === square[0] && attackedSquare[1] === square[1]);
};
