'use strict';

var protractor = require('protractor');
var Firebase = require('firebase');

describe('Sita Calculator Auth', function () {

    var login = function () {
        browser.driver.get('http://hoz-calculator-dev.com/#/auth');
        element(by.id('email')).clear().sendKeys(browser.params.login.user);
        element(by.id('pword')).clear().sendKeys(browser.params.login.password);
        element(by.id('sign-in')).click();
        browser.sleep(2000);
    };

    beforeEach(function () {
        browser.get('http://hoz-calculator-dev.com/index.html');
    });

    describe('Auth page', function () {

        it('should redirect to /auth when not logged in', function () {
            browser.driver.get('http://hoz-calculator-dev.com/#/info');
            expect(browser.getLocationAbsUrl()).toMatch(/\/auth/);

            browser.driver.get('http://hoz-calculator-dev.com/#/new-calculation');
            expect(browser.getLocationAbsUrl()).toMatch(/\/auth/);

            browser.driver.get('http://hoz-calculator-dev.com/#/new-calculation');
            expect(browser.getLocationAbsUrl()).toMatch(/\/auth/);

            // @todo why does this go to home before-hand?
            browser.driver.get('http://hoz-calculator-dev.com/#/my-calculations');
            expect(browser.getLocationAbsUrl()).toMatch(/\/home/);
        });

        it('should have forgotten password link and click', function () {
            var link = element(by.linkText('Forgotten password'));
            link.click();
            expect(browser.getLocationAbsUrl()).toMatch(/\/forgot-password/);
        });

        it('should have Change password link and click', function () {
            var link = element(by.linkText('Change password'));
            link.click();
            expect(browser.getLocationAbsUrl()).toMatch(/\/change-password/);
        });

        it('should log in', function () {
            login();
        });
    });
});