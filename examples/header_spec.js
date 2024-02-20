describe('header', function() {
	it('signin link should be visible', async function () {
		await $browser.get(url.format(default_url));
		return $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.headerSpec.signInLinkSelector)), waitForTimeout);

	});

});
