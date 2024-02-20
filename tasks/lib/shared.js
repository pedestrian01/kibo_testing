const fs = require('fs'),
    tmp = require('tmp'),
    helper = require('./helper'),
    path = require('path'),
    assert = require('assert'),
    testingOpts = require(path.resolve(__dirname, 'options.js'));
var Shared = {
    waitForElement: function(selector) {
        return $browser.wait($driver.until.elementLocated($driver.By.css(selector)), waitForTimeout);
    },
    waitForVisible: function(selector) {
        return $browser.wait($driver.until.elementIsVisible($driver.By.css(selector)), waitForTimeout);
    },
    findElement: function(selector){
        return $browser.findElement($driver.By.css(selector))
    },
    fillInput: async function (selector, text){
        let element = await this.findElement(selector);
        return element.sendKeys(text);
    },
    clickElement: async function(selector){
        let element = await this.findElement(selector);
        return element.click();
    },
    /*
     * Tests for checking for broken images using the `default_url`
     */     
    shouldNotHaveBrokenImages: function() {
        it('should have no broken images', function() {
            return $browser.get(url.format(default_url)).then(function(){
                return $browser.findElements($driver.By.tagName('img'));
            }).then(function(elements) {
                var promises = elements.map(function(element){
                    return expect(element).to.not.be.broken;
                });
                return Promise.all(promises);
            });
        });
    },
    
    /*
     * Tests for checking for broken links using the `default_url`
     */
    shouldNotHaveBrokenLinks: function() {
        it('should have no broken links', function() {
            return $browser.get(url.format(default_url)).then(function(){
                return $browser.findElements($driver.By.tagName('a'));
            }).then(function(elements) {
                var promises = elements.map(function(element){
                    return expect(element).to.not.be.broken;
                });
                return Promise.all(promises);
            });
        });
    },

    loadProductPage: async function() {
        let productUrl = default_url;
        productUrl.pathname = '/p/' + testingOpts.productSpec.productCode;
        await $browser.get(url.format(productUrl));
        return $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.productSpec.pageSelector)), waitForTimeout);
    },  

    addProductToCart: async function(){ 
        let self = this;
        let productUrl = default_url;
        productUrl.pathname = '/p/' + testingOpts.productSpec.productCode;
        await this.loadProductPage();
        let atcButton = await $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.productSpec.atcSelector)), waitForTimeout);
        await atcButton.click();
        return $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.cartSpec.pageSelector)), waitForTimeout);
        
    },

    proceedToCheckout: function(){
        let self = this;
        let cartUrl = default_url;
        cartUrl.pathname = '/cart';
        return $browser.get(url.format(cartUrl)).then(function() {
            return $browser.get(url.format(cartUrl)).then(function(){   
                return $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.cartSpec.proceedToCheckoutSelector)), waitForTimeout).then(function(button){
                    return button.click().then(function(){
                        $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.checkoutSpec.orderSummarySelector)), waitForTimeout)
                    });
                });

            });
        });
    },
    fillShippingAddress: async function() {        
        await this.waitForElement(testingOpts.checkoutSpec.shippingAddress.stepSelector);
        await this.clickElement(testingOpts.checkoutSpec.shippingAddress.stepSelector + ' ' + testingOpts.checkoutSpec.shippingAddress.countrySelector + ' > option[value="' + testingOpts.checkoutSpec.shippingAddress.country + '"]');
        await $browser.sleep(1000);
        await this.clickElement(testingOpts.checkoutSpec.shippingAddress.stepSelector + ' ' + testingOpts.checkoutSpec.shippingAddress.stateSelector + ' > option[value="' + testingOpts.checkoutSpec.shippingAddress.state + '"]');
        await $browser.sleep(1000);
        await this.clickElement(testingOpts.checkoutSpec.shippingAddress.stepSelector + ' ' + testingOpts.checkoutSpec.shippingAddress.typeSelector + ' > option[value="' + testingOpts.checkoutSpec.shippingAddress.type + '"]');
        await this.fillInput(testingOpts.checkoutSpec.shippingAddress.stepSelector + ' ' + testingOpts.checkoutSpec.shippingAddress.zipSelector, testingOpts.checkoutSpec.shippingAddress.zip);
        
        await this.fillInput(testingOpts.checkoutSpec.shippingAddress.stepSelector + ' ' + testingOpts.checkoutSpec.shippingAddress.phoneSelector, testingOpts.checkoutSpec.shippingAddress.phone);
        await this.fillInput(testingOpts.checkoutSpec.shippingAddress.stepSelector + ' ' + testingOpts.checkoutSpec.shippingAddress.address1Selector, testingOpts.checkoutSpec.shippingAddress.address1);
        await this.fillInput(testingOpts.checkoutSpec.shippingAddress.stepSelector + ' ' + testingOpts.checkoutSpec.shippingAddress.citySelector, testingOpts.checkoutSpec.shippingAddress.city);
        await this.fillInput(testingOpts.checkoutSpec.shippingAddress.stepSelector + ' ' + testingOpts.checkoutSpec.shippingAddress.firstNameSelector, testingOpts.checkoutSpec.shippingAddress.fName);
        await this.fillInput(testingOpts.checkoutSpec.shippingAddress.stepSelector + ' ' + testingOpts.checkoutSpec.shippingAddress.lastNameSelector, testingOpts.checkoutSpec.shippingAddress.lName);
        await this.fillInput(testingOpts.checkoutSpec.shippingAddress.stepSelector + ' ' + testingOpts.checkoutSpec.shippingAddress.address2Selector, testingOpts.checkoutSpec.shippingAddress.address2);
        return $browser.sleep(1000);         
    },
    selectShippingMethod: async function() {
        await $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.checkoutSpec.shippingMethod.stepSelector + '.is-incomplete')), waitForTimeout);
        let method = await $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.checkoutSpec.shippingMethod.stepSelector + ' ' + testingOpts.checkoutSpec.shippingMethod.shippingMethodSelector + '[value="' + testingOpts.checkoutSpec.shippingMethod.shippingMethodId + '"]')), waitForTimeout);
        await method.click();
        return $browser.sleep(2000);
    },
    selectPaymentMethod: async function(type){
        if(!testingOpts.checkoutSpec.paymentMethod.paymentTypeIds.hasOwnProperty(type)){
            throw new Error(`Payment type ${type} not supported`);
        }
        await $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + '.is-incomplete')), waitForTimeout);
        let method = await $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' #' + testingOpts.checkoutSpec.paymentMethod.paymentTypeIds[type])), waitForTimeout);
        return method.click();
    },
    fillBillingEmail: async function() {
        return $browser.findElement($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.emailAddressSelector)).sendKeys(testingOpts.checkoutSpec.paymentMethod.emailAddress);
    },

    clickNext: async function(stepSelector){
        await this.clickElement(stepSelector + ' ' + testingOpts.checkoutSpec.nextSelector);
        return $browser.wait($driver.until.elementLocated($driver.By.css(stepSelector + '.is-complete')), waitForTimeout);
    },   
    fillCreditCardInfo: function() {
        return $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.creditCard.typeSelector)), waitForTimeout).then(function(typeBox){
            $browser.findElement($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.creditCard.cardNumberSelector)).sendKeys(testingOpts.checkoutSpec.paymentMethod.creditCard.number);
            $browser.findElement($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.creditCard.typeSelector + ' option[value="' + testingOpts.checkoutSpec.paymentMethod.creditCard.type + '"]')).click();
            $browser.findElement($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.creditCard.nameOnCardSelector)).sendKeys(testingOpts.checkoutSpec.paymentMethod.creditCard.name);        
            $browser.findElement($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.creditCard.securityCodeSelector)).sendKeys(testingOpts.checkoutSpec.paymentMethod.creditCard.securityCode);  
            $browser.findElement($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.creditCard.expirationMonthSelector + ' option[value="' + testingOpts.checkoutSpec.paymentMethod.creditCard.expirationMonth + '"]')).click(); 
            $browser.findElement($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.creditCard.expirationYearSelector + ' option[value="' + testingOpts.checkoutSpec.paymentMethod.creditCard.expirationYear + '"]')).click();           
            return $browser.sleep(500);
        });
    },
    fillCheckInfo: async function() {
        await $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.check.nameOnCheckSelector)), waitForTimeout);
        await $browser.findElement($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.check.nameOnCheckSelector)).sendKeys(testingOpts.checkoutSpec.paymentMethod.check.name);
        await $browser.findElement($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.check.checkNumberSelecotr)).sendKeys(testingOpts.checkoutSpec.paymentMethod.check.checkNumber);        
        await $browser.findElement($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.check.routingNumberSelector)).sendKeys(testingOpts.checkoutSpec.paymentMethod.check.routingNumber);           
        return $browser.sleep(500);
        
    },
    selectIngenicoType: async function(type) {
        if(!testingOpts.checkoutSpec.paymentMethod.ingenico.types.hasOwnProperty(type.toLowerCase())){
            throw new Error(`${type} is not a supported ingenico credit card type`);
        }

        await $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.ingenico.typeSelector)), waitForTimeout);
        let option = await $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.ingenico.typeSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.ingenico.types[type.toLowerCase()])), waitForTimeout);
        return option.click();
    },
    ingenicoPaymentPageLoaded: function() {
        return this.waitForElement(testingOpts.checkoutSpec.paymentMethod.ingenico.cardNumberSelector);
    },
    fillIngenicoInfo: async function() {
        await this.fillInput(testingOpts.checkoutSpec.paymentMethod.ingenico.cardNumberSelector, testingOpts.checkoutSpec.paymentMethod.ingenico.cardNumber);        
        await this.fillInput(testingOpts.checkoutSpec.paymentMethod.ingenico.expirationDateSelector, testingOpts.checkoutSpec.paymentMethod.ingenico.expirationDate);
        await this.fillInput(testingOpts.checkoutSpec.paymentMethod.ingenico.securityCodeSelector, testingOpts.checkoutSpec.paymentMethod.ingenico.securityCode);
        await this.fillInput(testingOpts.checkoutSpec.paymentMethod.ingenico.nameSelector, testingOpts.checkoutSpec.paymentMethod.ingenico.name);
    },
    submitIngicoPayment: async function (expectSuccess) {
        await this.clickElement(testingOpts.checkoutSpec.paymentMethod.ingenico.payButtonSelector);
        if(expectSuccess) {
            return this.waitForElement(testingOpts.checkoutSpec.confirmationPageSelector);
        } else {
            await this.waitForElement(testingOpts.checkoutSpec.errorSelector);
            let errorMessageElement = await this.findElement(testingOpts.checkoutSpec.errorSelector + ' ' + testingOpts.checkoutSpec.errorMessageSelector);
            let errorMessage = await errorMessageElement.getText();
            return assert.strictEqual(errorMessage, testingOpts.checkoutSpec.rejectedErrorMessage);
        }
    },
    cancelIngenicoPayment: async function(){
        await this.clickElement(testingOpts.checkoutSpec.paymentMethod.ingenico.cancelButtonSelector);
        await this.waitForElement(testingOpts.checkoutSpec.errorSelector);
        let errorMessageElement = await this.findElement(testingOpts.checkoutSpec.errorSelector + ' ' + testingOpts.checkoutSpec.errorMessageSelector);
        let errorMessage = await errorMessageElement.getText();
        return assert.strictEqual(errorMessage, testingOpts.checkoutSpec.cancelledErrorMessage);
    },
    fillBillingAddress: async function() {
        if(testingOpts.checkoutSpec.paymentMethod.billingAddress.copyFromShipping){
            $browser.findElement($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.billingAddress.copyFromShippingSelector)).click();
            return $browser.sleep(500);
        } else {
            $browser.findElement($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.billingAddress.countrySelector + ' > option[value="' + testingOpts.checkoutSpec.paymentMethod.billingAddress.country + '"]')).click();               
            
            $browser.findElement($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.billingAddress.stateSelector + ' > option[value="' + testingOpts.checkoutSpec.paymentMethod.billingAddress.state + '"]')).click();

            $browser.findElement($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.billingAddress.zipSelector)).sendKeys(testingOpts.checkoutSpec.paymentMethod.billingAddress.zip);
            $browser.findElement($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.billingAddress.firstNameSelector)).sendKeys(testingOpts.checkoutSpec.paymentMethod.billingAddress.fName);
            $browser.findElement($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.billingAddress.lastNameSelector)).sendKeys(testingOpts.checkoutSpec.paymentMethod.billingAddress.lName);
            $browser.findElement($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.billingAddress.address1Selector)).sendKeys(testingOpts.checkoutSpec.paymentMethod.billingAddress.address1);
            $browser.findElement($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.billingAddress.address2Selector)).sendKeys(testingOpts.checkoutSpec.paymentMethod.billingAddress.address2);
            $browser.findElement($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.billingAddress.citySelector)).sendKeys(testingOpts.checkoutSpec.paymentMethod.billingAddress.city);
            $browser.findElement($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.billingAddress.phoneSelector)).sendKeys(testingOpts.checkoutSpec.paymentMethod.billingAddress.phone);
            $browser.findElement($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.billingAddress.stateSelector + ' > option[value="' + testingOpts.checkoutSpec.paymentMethod.billingAddress.state + '"]')).click();
            $browser.findElement($driver.By.css(testingOpts.checkoutSpec.paymentMethod.stepSelector + ' ' + testingOpts.checkoutSpec.paymentMethod.billingAddress.typeSelector + ' > option[value="' + testingOpts.checkoutSpec.paymentMethod.billingAddress.type + '"]')).click();
            return $browser.sleep(1000);
        }
    },
    placeOrder: function(expectSuccess) {
        return $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.checkoutSpec.review.stepSelector + ' ' + testingOpts.checkoutSpec.review.placeOrderSelector)), waitForTimeout).then(function(btn){
            return btn.click().then(function() {
                if(expectSuccess){
                    return $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.checkoutSpec.confirmationPageSelector)), waitForTimeout)
                } else {
                    return $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.checkoutSpec.errorSelector)), waitForTimeout).then(function(errors){
                        return $browser.findElement($driver.By.css(testingOpts.checkoutSpec.errorSelector + ' ' + testingOpts.checkoutSpec.errorMessageSelector)).getText().then(function(errorMessage){
                            return assert.strictEqual(errorMessage, testingOpts.checkoutSpec.authErrorMessage);
                        });
                        
                    });
                }

            });
        });
    },  
    login: function() {
        let self = this;
        let loginURL = default_url;
        loginURL.pathname = '/user/login/';
        loginURL.search = '?returnUrl=%2fmyaccount';
        return $browser.get(url.format(loginURL)).then(function(){                
            return $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.loginSpec.pageSelector)), waitForTimeout).then(function (container) {
                $browser.findElement($driver.By.css(testingOpts.loginSpec.emailInputSelector)).sendKeys(testingOpts.loginSpec.emailAddress);
                $browser.findElement($driver.By.css(testingOpts.loginSpec.passwordInputSelector)).sendKeys(testingOpts.loginSpec.password);
                return $browser.findElement($driver.By.css(testingOpts.loginSpec.loginButtonSelector)).click().then(function(){
                    return $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.loginSpec.accountPageSelector)), waitForTimeout);
                });
            });
        });
    },
    loadCategoryPage: async function() {
        let categoryUrl = default_url;
        categoryUrl.pathname = testingOpts.categorySpec.pathName;
        await $browser.get(url.format(categoryUrl));
        return $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.categorySpec.pageSelector)), waitForTimeout);

    },
    productListingVisible: async function() {
        return $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.categorySpec.productSelector + '[data-mz-product="' + testingOpts.categorySpec.productCode + '"]')), waitForTimeout);
    },
    productListingClickable: async function() {
        let listingLink = await $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.categorySpec.productSelector + '[data-mz-product="' + testingOpts.categorySpec.productCode + '"] ' + testingOpts.categorySpec.listingLinkSelector)), waitForTimeout);
        await listingLink.click();
        return $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.productSpec.pageSelector)), waitForTimeout);

    },
    productListingAddToCart: async function() {

    },
    search: async function(){
        
        await $browser.get(url.format(default_url));
        let searchBox = await $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.searchSpec.searchBoxSelector)), waitForTimeout);
        await searchBox.sendKeys(testingOpts.searchSpec.query);
        let searchButton = await $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.searchSpec.searchButtonSelector)), waitForTimeout);
        await searchButton.click();
        return $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.searchSpec.pageSelector)), waitForTimeout);

    },
    expectSearchResult: async function() {
        return $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.categorySpec.productSelector + '[data-mz-product="' + testingOpts.searchSpec.productCode + '"]')), waitForTimeout);
    },
    clickSearchResult: async function() {
        let listingLink = await $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.categorySpec.productSelector + '[data-mz-product="' + testingOpts.searchSpec.productCode + '"] ' + testingOpts.categorySpec.listingLinkSelector)), waitForTimeout);
        await listingLink.click();
        return $browser.wait($driver.until.elementLocated($driver.By.css(testingOpts.productSpec.pageSelector)), waitForTimeout);

    },
    shouldLookTheSame: function(name) {
        if(!testingOpts.visualCompare){
            return true;
        }
        describe('visual', function() {
            var looksSame = require('looks-same');
            var jimp = require('jimp');
            beforeEach('setup baseline', function() {
                var test = this.currentTest;

                name = name || this.currentTest.fullTitle();
                
                test.baselineFile = './test/baseline/' + helper.shotNameForTest(name);
                try {
                    fs.statSync(test.baselineFile);
                    test.baselineFileExists = true;
                }
                catch(e) {
                    test.baselineFileExists = false;
                }
                
                test.comparisonFile = tmp.fileSync().name;
            });
            
            afterEach('diff baseline', function() {
                var test = this.currentTest;
                name = name || this.currentTest.fullTitle();
                var jimpImages = {};
                //if(test && test.state === 'failed') {
                    return new Promise(function(resolve, reject) {
                        looksSame.createDiff({
                            reference: test.baselineFile,
                            current: test.comparisonFile,
                            diff: './test/shots/diff_' + helper.shotNameForTest(name),
                            highlightColor: '#ff00ff',
                            strict: false,
                            tolerance: 5
                        }, function(error) {
                            if(error) {
                                reject(error);
                            }
                            resolve();
                        });
                    })
                    .then(function() {
                        return jimp.read(test.baselineFile)
                    })
                    .then(function(image) {
                        jimpImages.baseline = image;
                        return jimp.read('./test/shots/diff_' + helper.shotNameForTest(name));
                    })
                    .then(function(image) {
                        jimpImages.diff = image;
                        jimpImages.diff.opacity(.75);
                        return jimp.read(test.comparisonFile);
                    })
                    .then(function(image) {
                        jimpImages.comparison = image;
                        jimpImages.comparison.opacity(.5);
                    })
                    .then(function() {
                        return new Promise(function(resolve, reject) {
                            jimpImages.baseline
                                .composite(jimpImages.diff, 0, 0)
                                .composite(jimpImages.comparison, 0, 0)
                                .write('./test/shots/mask_' + helper.shotNameForTest(name), resolve);
                        });
                    });
                //}
            });
            
            it('should look the same', function() {
                var test = this.test;
                
                return $browser.get(url.format(default_url)).then(function() {
                    return $browser.wait(function() {
                        return $browser.executeScript('return document.readyState;').then(function(result) {
                            return result === 'complete';
                        });
                    }, waitForTimeout).then(function() {
                        return $browser.sleep(5000);
                    });
                }).then(function(){
                    var promises = [];
                    //Add baseline image if missing
                    if(!test.baselineFileExists) {
                        promises.push(
                            $browser.takeScreenshot().then(function(data) {
                                fs.writeFileSync(test.baselineFile, data.replace(/^data:image\/png;base64,/,''), 'base64');
                            })
                        );
                    }
                    //
                    promises.push(
                        $browser.takeScreenshot().then(function(data) {
                            fs.writeFileSync(test.comparisonFile, data.replace(/^data:image\/png;base64,/,''), 'base64');
                        })
                    );
                    
                    //
                    return Promise.all(promises).then(function() {
                        return looksSame(test.baselineFile, test.comparisonFile);
                        /*return new Promise(function(resolve, reject) {
                            console.log(8);
                            looksSame(test.baselineFile, test.comparisonFile, function(error, equal) {

                                console.log(8.5);
                                if(error) {
                                    console.log(9);
                                    reject(error);
                                }
                                console.log(10);
                                resolve(equal);
                            });
                        });*/
                    }).then(function(equal) {
                        console.log(equal.equal);
                        return equal.equal;
                        if(!equal.equal){
                            done(new Error("Visual diff failed")); 
                        }
                        done();
                    });
                });
            });
        });
    },
    takeScreenshot: function(test) {
        var name = helper.shotNameForTest(test);
        let file = testingOpts.shotFolder + '/' + name;
        try {
            return browser.getCurrentUrl().then(function(url) {
                
                if(url === 'about:blank') {

                    return;
                }
                
                return browser.takeScreenshot().then(function(data) {
                    fs.writeFileSync(file, data.replace(/^data:image\/png;base64,/,''), 'base64');
                });
            });
        }
        catch(error) { console.error('Failed to create screen shot: ' + error); }
    }

};
exports = module.exports = Shared;