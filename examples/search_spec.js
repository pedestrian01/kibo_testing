describe('Search Results', function() {
	it('Should Search', function() {
		return shared.search();
	});

	it('Should Show Search Result', async function() {
		await shared.search();
		return shared.expectSearchResult();
	});

	it('Should Click Search Result', async function() {
		await shared.search();
		return shared.clickSearchResult();
	});


});