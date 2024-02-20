describe('Homepage', function() {
	it('Should Load', async function () {
		return $browser.get(url.format(default_url));
	});

});
