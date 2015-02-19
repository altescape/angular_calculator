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

        it('should log in', function () {
            login();
        });

        var info = {
            airline: "ABC",
            opportunity: "XYZ",
            version: "DEF"
        };

        it('should enter info', function() {
            browser.driver.get('http://hoz-calculator-dev.com/#/info');
            airline_text.clear().sendKeys(info.airline);
            opportunity_text.clear().sendKeys(info.opportunity);
            version_text.clear().sendKeys(info.version);
            expect(create_button.getAttribute('disabled')).toBeFalsy();
        });

        it('should log out', function() {
            browser.driver.get('http://hoz-calculator-dev.com/#/info');
            var sign_out_tab = element(by.css('.main-nav a[ui-sref="auth"]'));
            sign_out_tab.click();

            var sign_out_button = element(by.css('a[ng-click="logoutUser()"]'));
            sign_out_button.click();

            var sign_in_form = element(by.css('form[name="login"]'));
            expect(sign_in_form.isPresent()).toBe(true);
        });

        it('should clear data on logout', function() {
            login();
            browser.driver.get('http://hoz-calculator-dev.com/#/auth'); //should be sign out
            var sign_out_button = element(by.css('a[ng-click="logoutUser()"]'));
            sign_out_button.click();

            var footer_airline_code = element(by.css('.info-links li:nth-child(1) a')),
                footer_opportunity_name = element(by.css('.info-links li:nth-child(2) a')),
                footer_info_session_name = element(by.css('.info-links li:nth-child(3) a'));

            expect(footer_airline_code.getText()).not.toEqual(info.airline);
            expect(footer_opportunity_name.getText()).not.toEqual(info.opportunity);
            expect(footer_info_session_name.getText()).not.toEqual(info.version);
        });

        it('should hide bottom navbar on logout', function() {
            login();
            browser.driver.get('http://hoz-calculator-dev.com/#/auth'); //should be sign out
            var sign_out_button = element(by.css('a[ng-click="logoutUser()"]'));
            sign_out_button.click();

            expect(element(by.css('.navbar-fixed-bottom')).isPresent()).toBe(false);
        });
    });
});