describe('Checkout Page', function() {
	
	it('Should be able to checkout anonymously', async function() {

		await shared.addProductToCart();
		await shared.takeScreenshot('Anonymous Checkout ATC');
		await shared.proceedToCheckout();
		await shared.takeScreenshot('Anonymous Checkout Loaded');
		await shared.fillShippingAddress();
		await shared.takeScreenshot('Anonymous Checkout Shipping Address');
		await shared.selectShippingMethod();
		await shared.takeScreenshot('Anonymous Checkout Shipping Method');
		await shared.fillPaymentMethod();
		await shared.takeScreenshot('Anonymous Checkout Payment Method');
		return shared.placeOrder();
	
	});

	it('Should be able to checkout as logged in customer', async function () {
		await shared.login();
		await shared.takeScreenshot('Loggedin Checkout Login');
		await shared.addProductToCart();
		await shared.takeScreenshot('Loggedin Checkout ATC');
		await shared.proceedToCheckout();
		await shared.takeScreenshot('Loggedin Checkout Loaded');
		let addAddressLink = await $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.checkoutSpec.shippingAddress.stepSelector + ' ' + testingOpts.checkoutSpec.shippingAddress.addAddressLinkSelector)), waitForTimeout)
		await addAddressLink.click();
		await $browser.sleep(2000);
		await shared.fillShippingAddress();
		await shared.takeScreenshot('Loggedin Checkout Shipping Address');
		await shared.selectShippingMethod();
		await shared.takeScreenshot('Loggedin Checkout Shipping Method');
		await shared.fillPaymentMethod(true);
		await shared.takeScreenshot('Loggedin Checkout Payment Method');
		return shared.placeOrder();
	});


});