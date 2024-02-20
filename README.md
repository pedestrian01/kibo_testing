# Kibo Testing Suite
**Current Version: 1.0.0**
## Prerequisites 
- [ ] Create Prerequisites section

## Installation
1. Install Testing package from Git Repository 
 `npm i git+https://bitbucket.pearson.com/scm/pvmhkt/kibo_testing.git --save`
 2. Add testing tasks to your Gruntfile.js file
 `grunt.loadNpmTasks('kibo_testing');`
 3. Add reference to config file in the grunt.initConfig call of you Gruntfile.js file.
 `testing: grunt.file.exists('./testing.config.json') ? grunt.file.readJSON('./testing.config.json') : {},`
 4. Copy example config file to project
 `grunt testing examples:config`
 5. Rename *testing.config.json.example* to *testing.config.json*
 6. Run the scaffoldtask to create required directories and copy example specs
 `grunt testing:scaffold`
 7. Update *testing.config.json* with the values for your environment(s). See section **Configuation** for more details.
 8. Confirm basic setup by running example homepage_spec test (load homepage)
`grunt testing --spec=homepage_spec`
9.  Update/add tests as needed for your project. See section **Writing Tests** for more details

## Configuration
The *testing.config.json* file contains all testing options specific to your project. The testing suite itself also contains many default values for options. For a full list of default options and their values see **Appendix a: Default Options**. For a list of all options required to use the shared tests see **Appendix c: Shared Test Options**
There are 3 top level properties that should be defined in the JSON.
1. **defaultEnvironment**: *string* - This is the key for your default environment to run tests against if an environment is not specified.
2. **global**: object* - This object stores global level options to use in tests
3. **environments**: *object* - This object stores environment level objects. The keys of this object are what are used to target a specific environment when running tests (and for specifying the defaultEnvironment above)

Options are read in a leveled system with each level overriding any values on the previous levels. There are 3 levels of options:
4. Default options apply to all environments unless overridden by either a global or environment value. These primarily consist of various selectors used for the shared tests available.  
5. Global options apply to all environments unless overridden. They override any default level values.
6. Environment options are defined in each environment object and override values in either the global or default level.


## Writing Tests 
- [ ] Create Writing Test Section 

## Running Tests
The primary task of this suite is `grunt testing` without any further options this will attempt to run all files in your *specFolder* against the *defaultEnvironment*. You can augment the default behavior by providing the following flags:

* **env** : The environment key as defined in the configuration to run the tests against
example : `grunt testing --env=production`
* **spec** : The specification file to run. Do not include the *.js*
example : `grunt testing --spec=checkout_spec`

Using the flag syntax these flags can be used independently or together. The flags can also be called using Grunt's subcommand syntax however in this format the *spec* flag cannot be used on it's own.
examples : 
* `grunt testing:production ` will run all tests against the production environment
* `grunt testing:production:checkout_spec ` will run the checkout specification against the production environment

### Appendix a: Default Options
Syntax: 
**optionName** *optionType* ==defaultValue==

**clearScreenShots** *boolean* ==true==
**specFolder** *string* ==./test/specs==
**shotFolder** *string* ==./test/shots==
**timeOut** *number* ==7000==
**visualCompare** *boolean* ==true==
**systemArch** *string* ==win64==
**browserOptions** *object*
> **type** *string* ==chrome==
> **size** *object*
>> **width** *number* ==1600==
>> **height** *number* ==1200==

> **closeOnTestComplete** *boolean* ==true==
> **clearCookiesOnTestComplete** *boolean* ==true==

**headerSpec** *object*
> **signInLinkSelector** *string* ==.mz-utilitynav-link.signinIcon==

**productSpec** *object*
> **pageSelector** *string* ==.mz-product==
> **atcSelector** *string* ==#add-to-cart==

**cartSpec** *object*
> **pageSelector** *string* ==.mz-cart==
> **proceedToCheckoutSelector** *string* ==#cart-checkout==

**checkoutSpec** *object*
> **errorSelector** *string* ==.mz-errors==
> **errorMessageSelector** *string* ==.mz-message-item==
> **orderSummarySelector** *string* ==#order-summary==
> **summarySelector** *string* ==.mz-formstep-summary==
> **nextSelector** *string* ==[data-mz-action="next"]==
> **confirmationPageSelector** *string* ==.mz-confirmation==
> **authErrorMessage** *string* ==Validation Error: Auth and Capture was declined==
> **rejectedErrorMessage** *string* ==Payment is rejected==
> **cancelledErrorMessage** *string* ==Payment is cancelled , please try again==
> **shippingAddress** *object*
>> **stepSelector** *string* ==#step-shipping-address==
>> **firstNameSelector** *string* ==[data-mz-value="firstName"]==
>> **lastNameSelector** *string* ==[data-mz-value="lastNameOrSurname"]==
>> **address1Selector** *string* ==[data-mz-value="address.address1"]==
>> **address2Selector** *string* ==[data-mz-value="address.address2"]==
>> **countrySelector** *string* ==[data-mz-value="address.countryCode"]==
>> **stateSelector** *string* ==[data-mz-value="address.stateOrProvince"]==
>> **citySelector** *string* ==[data-mz-value="address.cityOrTown"]==
>> **zipSelector** *string* ==[name="postal-code"]==
>> **phoneSelector** *string* ==[data-mz-value="phoneNumbers.home"]==
>> **typeSelector** *string* ==[data-mz-value="address.addressType"]==
>> **addAddressLinkSelector** *string* ==[data-mz-action="beginAddContact"]==

> **shippingMethod** *object*
>> **stepSelector** *string* ==#step-shipping-method==
>> **shippingMethodSelector** *string* ==[data-mz-value="shippingMethodCode"]==

> **paymentMethod** *object*
>> **stepSelector** *string* ==#step-payment-info==
>> **paymentTypeSelector** *string* ==[data-mz-value="paymentType"]==
>> **paymentTypeIds** *object*
>>> **newCreditCard** *string* ==paymentType-newcreditcard-0==
>>> **check** *string* ==paymentType-check-0==
>>> **savedCreditCard** *string* ====
>>> **purchaseOrder** *string* ====
>>> **ingenicoCreditCard** *string* ==paymentType-ingenicoexpress2-0==
>>> **wireTransfer** *string* ====

>> **billingAddress** *object*
>>> **copyFromShipping** *boolean* ==false==
>>> **copyFromShippingSelector** *string* ==[data-mz-value="isSameBillingShippingAddress"]==
>>> **firstNameSelector** *string* ==[data-mz-value="billingContact.firstName"]==
>>> **lastNameSelector** *string* ==[data-mz-value="billingContact.lastNameOrSurname"]==
>>> **address1Selector** *string* ==[data-mz-value="billingContact.address.address1"]==
>>> **address2Selector** *string* ==[data-mz-value="billingContact.address.address2"]==
>>> **countrySelector** *string* ==[data-mz-value="billingContact.address.countryCode"]==
>>> **stateSelector** *string* ==[data-mz-value="billingContact.address.stateOrProvince"]==
>>> **citySelector** *string* ==[data-mz-value="billingContact.address.cityOrTown"]==
>>> **phoneSelector** *string* ==[data-mz-value="billingContact.phoneNumbers.home"]==
>>> **zipSelector** *string* ==[name="postal-code"]==
>>> **typeSelector** *string* ==[data-mz-value="billingContact.address.addressType"]==

>> **emailAddressSelector** *string* ==[data-mz-value="billingContact.email"]==
>> **creditCard** *object*
>>> **typeSelector** *string* ==[data-mz-value="card.paymentOrCardType"]==
>>> **cardNumberSelector** *string* ==[data-mz-value="card.cardNumberPartOrMask"]==
>>> **nameOnCardSelector** *string* ==[data-mz-value="card.nameOnCard"]==
>>> **expirationMonthSelector** *string* ==[data-mz-value="card.expireMonth"]==
>>> **expirationYearSelector** *string* ==[data-mz-value="card.expireYear"]==
>>> **securityCodeSelector** *string* ==[data-mz-value="card.cvv"]==

>> **check** *object*
>>> **nameOnCheckSelector** *string* ==[data-mz-value="check.nameOnCheck"]==
>>> **checkNumberSelecotr** *string* ==[data-mz-value="check.checkNumber"]==
>>> **routingNumberSelector** *string* ==[data-mz-value="check.routingNumber"]==

>> **ingenico** *object*
>>> **typeSelector** *string* ==[data-mz-value="ingenicoexpress2.paymentId"]==
>>> **types** *object*
>>>> **visa** *string* ==[value="1"]==
>>>> **mastercard** *string* ==[value="3"]==
>>>> **amex** *string* ==[value="2"]==

>>> **cardNumberSelector** *string* ==#cardNumber==
>>> **expirationDateSelector** *string* ==#expiryDate==
>>> **securityCodeSelector** *string* ==#cvv==
>>> **nameSelector** *string* ==#cardholderName==
>>> **payButtonSelector** *string* ==#primaryButton==
>>> **cancelButtonSelector** *string* ==#secondaryButton==


> **review** *object*
>> **stepSelector** *string* ==#step-review==
>> **placeOrderSelector** *string* ==[data-mz-action="submit"]==


**loginSpec** *object*
> **pageSelector** *string* ==.mz-loginpage==
> **emailInputSelector** *string* ==[data-mz-login-email]==
> **passwordInputSelector** *string* ==[data-mz-login-password]==
> **loginButtonSelector** *string* ==[data-mz-action="loginpage-submit"]==
> **accountPageSelector** *string* ==.mz-myaccount==

**categorySpec** *object*
> **pageSelector** *string* ==.mz-category==
> **productSelector** *string* ==.mz-productlist-item==
> **listingLinkSelector** *string* ==.mz-productlisting==
> **atcSelector** *string* ==.listing-atc==

**searchSpec** *object*
> **searchBoxSelector** *string* ==[data-mz-role="searchquery"]==
> **searchButtonSelector** *string* ==.mz-searchbox-button==
> **pageSelector** *string* ==.mz-searchresults==


### Appendix b: Shared Tests
- [ ] Create Shared Tests Section
### Appendix c: Shared Test Options
- [ ] Create Shared Tests Option Section

