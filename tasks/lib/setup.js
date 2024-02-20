var fs = require('fs'),
    process = require('process'),
    path = require('path');
global.testingOpts = require(path.resolve(__dirname, 'options.js'));
//Make our shared tests global since these actually define test cases
global.shared = require('./shared');
global.helper = require('./helper');



before('create browser', function() {
    global.driver = global.$driver = require('selenium-webdriver');
    var chrome = require('selenium-webdriver/chrome');
    var firefox = require('selenium-webdriver/firefox');


    let browserType = testingOpts.browserOptions.type;
    let chromeOptions =  new chrome.Options();
    let firefoxOptions =  new firefox.Options();

    let chromeService = new chrome.ServiceBuilder();
    if(testingOpts.hasOwnProperty('chromeDriverPath')){
        chromeService = new chrome.ServiceBuilder(testingOpts.chromeDriverPath);        
    }

    

    if(testingOpts.hasOwnProperty('chromeOptions') && testingOpts.chromeOptions.length > 0){
        for(let i = 0; i < testingOpts.chromeOptions.length; i++){
            chromeOptions.addArguments('--' + testingOpts.chromeOptions[i]);
        }
    }

    if(testingOpts.hasOwnProperty('firefoxOptions') && testingOpts.firefoxOptions.length > 0){
        for(let i = 0; i < testingOpts.firefoxOptions.length; i++){
            firefoxOptions.addArguments('--' + testingOpts.firefoxOptions[i]);
        }
    }

    //Add window size options to browser options


    chromeOptions.addArguments(`--window-size=${testingOpts.browserOptions.size.width},${testingOpts.browserOptions.size.height}`)
    firefoxOptions.addArguments(`--width=${testingOpts.browserOptions.size.width}`);
    firefoxOptions.addArguments(`--height=${testingOpts.browserOptions.size.height}`);
    global.browser = global.$browser = new driver.Builder()
    .forBrowser(browserType)
    .setChromeOptions(chromeOptions)
    .setChromeService(chromeService)
    .setFirefoxOptions(firefoxOptions)
    .build();



});

beforeEach('default url', function() {
    global.url = require('url');
    global.default_url = url.parse(testingOpts.url);
});

beforeEach('Running Test ', function() {
    let test = this.test;
    console.log(test.fullTitle() + '\n');
});

beforeEach('Add Cookies', function() {
    if(testingOpts.cookies && testingOpts.cookies.length > 0){
        return $browser.get(url.format(default_url)).then(function(){
            let promises = [];

            for(let i =0; i< testingOpts.cookies.length; i++){
                let cookie = testingOpts.cookies[i];
                promises.push(browser.manage().addCookie(cookie));
            }

            return Promise.all(promises);

        });

    }
});
beforeEach('wait time out', function() {
    global.waitForTimeout = testingOpts.timeOut || 3000;
});

afterEach('screen shot', function() {
    var test = this.currentTest;
    return shared.takeScreenshot(test.fullTitle());
});

afterEach('clear cookies', function() {
    if(testingOpts.browserOptions.clearCookiesOnTestComplete){
        return browser.manage().deleteAllCookies();
    }
});

after('quit browser', function() {
    if(testingOpts.browserOptions.closeOnTestComplete){
        return browser.quit();
    }
});