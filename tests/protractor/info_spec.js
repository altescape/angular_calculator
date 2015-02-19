'use strict';

var protractor = require('protractor');
var Firebase = require('firebase');

describe('Sita Calculator', function () {

    /**
     * A little more involved than the function in auth_spec
     * as it checks if logged and acts accordingly.
     */
    var login = function () {

        browser.driver.get('http://hoz-calculator-dev.com/#/auth');

        var logged_in = false,
            main_nav_check = element(by.css('.so_link')).getText().then(function (text) {
            if (text === "Sign Out") { logged_in = true; }
        });

        if (logged_in) {
            browser.driver.get('http://hoz-calculator-dev.com/#/info');
        } else {
            browser.driver.get('http://hoz-calculator-dev.com/#/auth');
            element(by.id('email')).clear().sendKeys(browser.params.login.user);
            element(by.id('pword')).clear().sendKeys(browser.params.login.password);
            element(by.id('sign-in')).click();
            browser.sleep(2000);
        }
    };

    beforeEach(function () {
        //browser.get('http://hoz-calculator-dev.com/index.html');
    });

    describe('info page', function () {

        var airline_text = element(by.id('acode')),
            opportunity_text = element(by.id('oname')),
            version_text = element(by.id('sname')),
            currency_dropdown = element(by.id('currency')),
            create_button = element(by.id('create_button')),
            update_button = element(by.id('update_button'));

        it('should be able to log in', function () {
            login();
        });

        it('should disable Create new calculation button when all fields are empty', function () {
            browser.driver.get('http://hoz-calculator-dev.com/#/info');
            airline_text.clear();
            opportunity_text.clear();
            version_text.clear();
            expect(create_button.getAttribute('disabled')).toBeTruthy();
            expect(update_button.isDisplayed()).toBeFalsy();
        });

        it('should disable Create new calculation button when one field is empty (Airline)', function () {
            browser.driver.get('http://hoz-calculator-dev.com/#/info');
            airline_text.clear();
            opportunity_text.clear().sendKeys(123);
            version_text.clear().sendKeys('XYZ');
            expect(create_button.getAttribute('disabled')).toBeTruthy();
            expect(update_button.isDisplayed()).toBeFalsy();
        });

        it('should disable Create new calculation button when one field is empty (Opportunity)', function () {
            browser.driver.get('http://hoz-calculator-dev.com/#/info');
            airline_text.clear().sendKeys(123);
            opportunity_text.clear();
            version_text.clear().sendKeys('XYZ');
            expect(create_button.getAttribute('disabled')).toBeTruthy();
            expect(update_button.isDisplayed()).toBeFalsy();
        });

        it('should disable Create new calculation button when one field is empty (Version)', function () {
            browser.driver.get('http://hoz-calculator-dev.com/#/info');
            airline_text.clear().sendKeys(123);
            opportunity_text.clear().sendKeys('XYZ');
            version_text.clear();
            expect(create_button.getAttribute('disabled')).toBeTruthy();
            expect(update_button.isDisplayed()).toBeFalsy();
        });

        it('should enable button once form is completed', function() {
            browser.driver.get('http://hoz-calculator-dev.com/#/info');
            expect(create_button.getAttribute('disabled')).toBeTruthy();
            airline_text.clear().sendKeys(123);
            opportunity_text.clear().sendKeys(456);
            version_text.clear().sendKeys(789);
            expect(create_button.getAttribute('disabled')).toBeFalsy();
            expect(update_button.isDisplayed()).toBeFalsy();
        });

        it('should update footer', function() {
            browser.driver.get('http://hoz-calculator-dev.com/#/info');
            airline_text.clear().sendKeys(123);
            opportunity_text.clear().sendKeys(456);
            version_text.clear().sendKeys(789);

            browser.sleep(1000);

            var footer_airline_code = element(by.css('.info-links li:nth-child(1) a')),
                footer_opportunity_name = element(by.css('.info-links li:nth-child(2) a')),
                footer_info_session_name = element(by.css('.info-links li:nth-child(3) a'));

            expect(footer_airline_code.getText()).toEqual(airline_text.getAttribute('value'));
            expect(footer_opportunity_name.getText()).toEqual(opportunity_text.getAttribute('value'));
            expect(footer_info_session_name.getText()).toEqual(version_text.getAttribute('value'));
        });

        it('should change currency', function() {
            browser.driver.get('http://hoz-calculator-dev.com/#/info');
            var dd = element(by.cssContainingText('option', 'British Pound Sterling')).click();
            expect(dd.getAttribute('value')).toMatch('GBP');
        });

        it('should go to calculator once form is completed', function() {
            browser.driver.get('http://hoz-calculator-dev.com/#/info');
            airline_text.clear().sendKeys('airline code test');
            opportunity_text.clear().sendKeys('opportunity test ');
            version_text.clear().sendKeys(Date.now());
            create_button.click();
            expect(browser.getLocationAbsUrl()).toMatch(/\/calculator/);
        });

        it('should change button to update calculation once form is saved', function () {
            // test should still be logged in and in a current session
            browser.driver.get('http://hoz-calculator-dev.com/#/info');
            expect(update_button.isDisplayed()).toBeTruthy();
            expect(create_button.isDisplayed()).toBeFalsy();
        });

        it('should change footer save button once form is saved', function () {
            // test should still be logged in and in a current session
            browser.driver.get('http://hoz-calculator-dev.com/#/info');
            var footer_save_button = element(by.css('a[ng-click="saveNewSession()"]'));
            var footer_update_button = element(by.css('a[ng-click="updateSession()"]'));
            expect(footer_update_button.isDisplayed()).toBeTruthy();
            expect(footer_save_button.isDisplayed()).toBeFalsy();
        });
    });
});