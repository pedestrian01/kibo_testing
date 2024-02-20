const process = require('process');
const path = require('path');
let defaultOptions = {
	clearScreenShots: true,
	specFolder: './test/specs/e2e',
	shotFolder: './test/shots',
	timeOut: 7000,
	visualCompare: true,
	systemArch: 'win64',
    browserOptions: {
        type: 'chrome',
        size: {
            width: 1600,
            height: 1200
        },
        closeOnTestComplete: true,
        clearCookiesOnTestComplete: true
    },
    headerSpec: {
    	signInLinkSelector: '.mz-utilitynav-link.signinIcon'
    },
    productSpec: {
    	pageSelector: '.mz-product',
    	atcSelector: '#add-to-cart'
    },
    cartSpec: {
    	pageSelector: '.mz-cart',
    	proceedToCheckoutSelector: '#cart-checkout'
    },
    checkoutSpec: {
    	errorSelector: '.mz-errors',
    	errorMessageSelector: '.mz-message-item',
    	orderSummarySelector: '#order-summary',
    	summarySelector: '.mz-formstep-summary',
    	nextSelector: '[data-mz-action="next"]',
    	confirmationPageSelector:".mz-confirmation",
    	authErrorMessage: 'Validation Error: Auth and Capture was declined',
    	rejectedErrorMessage: 'Payment is rejected',
    	cancelledErrorMessage: 'Payment is cancelled , please try again',
    	shippingAddress: {
    		stepSelector: '#step-shipping-address',
    		firstNameSelector: '[data-mz-value="firstName"]',
    		lastNameSelector: '[data-mz-value="lastNameOrSurname"]',
    		address1Selector: '[data-mz-value="address.address1"]',
    		address2Selector: '[data-mz-value="address.address2"]',    		
    		countrySelector: '[data-mz-value="address.countryCode"]',
    		stateSelector: '[data-mz-value="address.stateOrProvince"]',
    		citySelector: '[data-mz-value="address.cityOrTown"]',
    		zipSelector: '[name="postal-code"]',
    		phoneSelector: '[data-mz-value="phoneNumbers.home"]',
    		typeSelector: '[data-mz-value="address.addressType"]',
    		addAddressLinkSelector: '[data-mz-action="beginAddContact"]'
    	},
    	shippingMethod: {
    		stepSelector: '#step-shipping-method',
    		shippingMethodSelector: '[data-mz-value="shippingMethodCode"]'
    	},
    	paymentMethod: {
    		stepSelector: '#step-payment-info',
    		paymentTypeSelector: '[data-mz-value="paymentType"]',
    		paymentTypeIds: {
    			newCreditCard: 'paymentType-newcreditcard-0',
    			check: 'paymentType-check-0',
    			savedCreditCard: '',
    			purchaseOrder: '',
    			ingenicoCreditCard: 'paymentType-ingenicoexpress2-0',
    			wireTransfer: ''
    		},
    		billingAddress: {
    			copyFromShipping: false,
    			copyFromShippingSelector: '[data-mz-value="isSameBillingShippingAddress"]',
    			firstNameSelector: '[data-mz-value="billingContact.firstName"]',
	    		lastNameSelector: '[data-mz-value="billingContact.lastNameOrSurname"]',
	    		address1Selector: '[data-mz-value="billingContact.address.address1"]',
	    		address2Selector: '[data-mz-value="billingContact.address.address2"]',    		
	    		countrySelector: '[data-mz-value="billingContact.address.countryCode"]',
	    		stateSelector: '[data-mz-value="billingContact.address.stateOrProvince"]',
	    		citySelector: '[data-mz-value="billingContact.address.cityOrTown"]',
    			phoneSelector: '[data-mz-value="billingContact.phoneNumbers.home"]',
	    		zipSelector: '[name="postal-code"]',
    			typeSelector: '[data-mz-value="billingContact.address.addressType"]'
    		},
    		emailAddressSelector: '[data-mz-value="billingContact.email"]',
    		creditCard: {
    			typeSelector: '[data-mz-value="card.paymentOrCardType"]',
    			cardNumberSelector: '[data-mz-value="card.cardNumberPartOrMask"]',
    			nameOnCardSelector: '[data-mz-value="card.nameOnCard"]',
    			expirationMonthSelector: '[data-mz-value="card.expireMonth"]',
    			expirationYearSelector: '[data-mz-value="card.expireYear"]',
    			securityCodeSelector: '[data-mz-value="card.cvv"]'
    		},
    		check: {
    			nameOnCheckSelector: '[data-mz-value="check.nameOnCheck"]',
    			checkNumberSelecotr: '[data-mz-value="check.checkNumber"]',
    			routingNumberSelector: '[data-mz-value="check.routingNumber"]'
    		},
    		ingenico: {
    			typeSelector: '[data-mz-value="ingenicoexpress2.paymentId"]',
    			types: {
    				visa: '[value="1"]',
    				mastercard: '[value="3"]',
    				amex: '[value="2"]'
    			},
    			cardNumberSelector: '#cardNumber',
    			expirationDateSelector: '#expiryDate',
    			securityCodeSelector: '#cvv',
    			nameSelector: '#cardholderName',
    			payButtonSelector: '#primaryButton',
    			cancelButtonSelector: '#secondaryButton'
    		}
    	},
    	review: {
    		stepSelector: '#step-review',
    		placeOrderSelector: '[data-mz-action="submit"]'
    	}
    },
    loginSpec: {
    	pageSelector: '.mz-loginpage',
    	emailInputSelector: '[data-mz-login-email]',
    	passwordInputSelector: '[data-mz-login-password]',
    	loginButtonSelector: '[data-mz-action="loginpage-submit"]',
    	accountPageSelector: '.mz-myaccount'
    },
    categorySpec: {
    	pageSelector: '.mz-category',
    	productSelector: '.mz-productlist-item',
    	listingLinkSelector: '.mz-productlisting',
    	atcSelector: '.listing-atc',
    	
    },
    searchSpec: {
    	searchBoxSelector: '[data-mz-role="searchquery"]',
    	searchButtonSelector: '.mz-searchbox-button',
    	pageSelector: '.mz-searchresults'
    }

};



let allOptions = JSON.parse(process.env.TESTING_OPTIONS) || {};
let envName = process.env.TESTING_ENV;

function mergeObject(obj1, obj2){
	let merged = {};
	for(prop in obj1){
		if(obj1.hasOwnProperty(prop)){
			if(obj2.hasOwnProperty(prop)) {
				if((typeof obj1[prop]).toLowerCase() !== 'object'){
					merged[prop] = obj2[prop];
				}
				else {
					if(Array.isArray(obj1[prop])){
						merged[prop] = obj1[prop].concat(obj2[prop])
					} else {
						merged[prop] = mergeObject(obj1[prop], obj2[prop]);
					}

				}
			}
			else {
				merged[prop] = obj1[prop];
			}
		}
	}

	for(prop in obj2){
		if(obj2.hasOwnProperty(prop)) {			
			if(!merged.hasOwnProperty(prop)){
				merged[prop] = obj2[prop]
			}
		}
	}

	return merged;
}

if(!allOptions.hasOwnProperty('environments') || !allOptions.environments.hasOwnProperty(envName)){
	throw new Error(`${envName} not found in list of environments. Please check your configuration.`);
}

let globalOptions = allOptions.global || {};
let envOptions = mergeObject(globalOptions, allOptions.environments[envName]);
module.exports = mergeObject(defaultOptions,envOptions);


