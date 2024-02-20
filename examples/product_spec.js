describe('Product Page', function() {	

	it('Should Load', async function(){
		await shared.loadProductPage();
        return shared.shouldNotHaveBrokenImages();
	});

	it('Should Add To Cart', function() {
		return shared.addProductToCart();
	});
	
});