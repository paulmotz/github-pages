import { removeDuplicates } from './helpers';

describe('helpers', () => {
	describe('removeDuplicates', () => {
		it('should return remove duplcates from an array', () => {
			const arrayWithDuplicates = [
				[ 1, 3 ],
				[ 2, 3 ],
				[ 1, 3 ],
			];
			const arrayWithoutDuplicates = [
				[ 1, 3 ],
				[ 2, 3 ],
			];
			
			const resultingArray = removeDuplicates(arrayWithDuplicates);

			expect(resultingArray).toEqual(arrayWithoutDuplicates);
		});

		it('should return the initial array when ther are no duplicates', () => {
			const arrayWithoutDuplicates = [
				[ 1, 3 ],
				[ 2, 3 ],
			];
			
			const resultingArray = removeDuplicates(arrayWithoutDuplicates);

			expect(resultingArray).toEqual(arrayWithoutDuplicates);
		});
	});
});
