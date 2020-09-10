import { PieceColor, SquareLocation, PiecesByType, GetLegalMoveParams, IsCheckmateParams } from '@/lib/types';
import { removeDuplicates } from './helpers';
import { Piece, Pawn, Knight, Bishop, Rook, Queen, King } from '@/lib/games/chess/pieces';

export const getKingLocation = (allPieces: PiecesByType, color: PieceColor): SquareLocation => {
	const [ king ] = allPieces[`${color[0]}K`];
	return {
		rank : king.rank,
		file : king.file,
	};
};

export const getKing = (allPieces: PiecesByType, color: PieceColor): Piece => {
	return allPieces[`${color[0]}K`][0];
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

export const getCheckingPath = (checkingPieceLocation: SquareLocation, kingLocation: SquareLocation, shouldExtendPath: boolean): number[][] => {
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

	if (shouldExtendPath) {
		path.push([ pathRank + checkDirection.rank * 2, pathFile + checkDirection.file * 2 ]);
	}

	return path;
};

export const isSquareAttacked = (square: number[], attackedSquares: number[][]): boolean => {
	return !!attackedSquares.find(attackedSquare => attackedSquare[0] === square[0] && attackedSquare[1] === square[1]);
};

export const removeAttackedSquares = (moves: number[][], attackedSquares: number[][]): number[][] => {
	return moves.filter(move => {
		return !attackedSquares.find(attackedSquare => move[0] === attackedSquare[0] && move[1] === attackedSquare[1]);
	});
};

export const getLegalMoves = ({
	allPieces,
	checkingPieces,
	clickedPiece,
	colorToMoveNext,
	occupiedSquares,
}: GetLegalMoveParams): number[][] => {
	if (clickedPiece == null) {
		return [];
	}

	if (checkingPieces.length === 0) {
		return clickedPiece.moves({
			occupiedSquares : occupiedSquares,
			allPieces       : allPieces,
		});
	}

	const legalMoves = [];
	const kingLocation = getKingLocation(allPieces, colorToMoveNext);
	// When there is only one piece checking, it might be able to be captured or blocked
	if (checkingPieces.length === 1) {
		const [ checkingPiece ] = checkingPieces;

		const checkingPieceRank = checkingPiece.rank;
		const checkingPieceFile = checkingPiece.file;

		const clickedPieceProtectedSquares = clickedPiece instanceof King
			? clickedPiece.moves({
				allPieces       : allPieces,
				occupiedSquares : occupiedSquares,
			})
			: clickedPiece.protectedSquares(occupiedSquares);

		const captureMove: number[] | undefined = clickedPieceProtectedSquares.find(square =>
			square[0] === checkingPieceRank && square[1] === checkingPieceFile,
		);
		if (captureMove) {
			legalMoves.push(captureMove);
		}

		// Neither knights nor pawns can be blocked when checking
		if (!(checkingPiece instanceof Knight) && !(checkingPiece instanceof Pawn)) {
			const clickedPieceMoveSquares = clickedPiece.moves({ occupiedSquares : occupiedSquares });

			const checkingPath = getCheckingPath(checkingPiece, kingLocation, false);

			const overlap = clickedPieceMoveSquares.filter(defendingSquare => {
				return checkingPath.find(attackingSquare =>
					defendingSquare[0] === attackingSquare[0] && defendingSquare[1] === attackingSquare[1],
				);
			});

			if (overlap.length > 0) {
				legalMoves.push(...overlap);
			}
		}
	}

	if (clickedPiece instanceof King) {
		const checkingPaths = checkingPieces.map(checkingPiece => {
			if (checkingPiece instanceof Bishop || checkingPiece instanceof Rook || checkingPiece instanceof Queen) {
				return [ ...getCheckingPath(checkingPiece, kingLocation, true) ];
			}

			return [];
		}).flat();

		const kingMoves = clickedPiece.moves({
			occupiedSquares : occupiedSquares,
			allPieces       : allPieces,
		});

		legalMoves.push(...removeAttackedSquares(kingMoves, checkingPaths));
	}

	return removeDuplicates(legalMoves);
};

export const isCheckmate = ({
	allPieces,
	colorToMoveNext,
	occupiedSquares,
}: IsCheckmateParams): boolean => {
	const checkingPieces = getCheckingPieces(allPieces, occupiedSquares, colorToMoveNext);

	if (checkingPieces.length === 0) {
		return false;
	}

	for (const pieceType in allPieces) {
		if (pieceType[0] === colorToMoveNext[0]) {
			for (const piece of allPieces[pieceType]) {
				if (getLegalMoves({
					allPieces       : allPieces,
					checkingPieces,
					clickedPiece    : piece,
					colorToMoveNext : colorToMoveNext,
					occupiedSquares : occupiedSquares,
				}).length > 0) {
					return false;
				}
			}
		}
	}

	return true;
};
