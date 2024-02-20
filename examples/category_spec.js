describe('Category Page', function() {

	it('Should Load', function() {
		return shared.loadCategoryPage();
	});

	it('Should Show Product Listing', async function() {
		await shared.loadCategoryPage();
		return shared.productListingVisible();
	});

	it('Should Click Product Listing', async function() {
		await shared.loadCategoryPage();
		return shared.productListingClickable();
	});


});