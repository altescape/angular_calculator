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
        var logged_in = false;
        element(by.css('.so_link')).getText().then(function (text) {
            if (text === "Sign Out") { logged_in = true; }
        });

        if (logged_in) { browser.driver.get('http://hoz-calculator-dev.com/#/saved-calculations') }
        if (!logged_in) { enter_login_details() }
    };

    var enter_login_details = function () {
        browser.driver.get('http://hoz-calculator-dev.com/#/auth');
        element(by.id('email')).clear().sendKeys(browser.params.login.user);
        element(by.id('pword')).clear().sendKeys(browser.params.login.password);
        element(by.id('sign-in')).click();
        browser.sleep(2000);
    };

    describe('saved calculations functionality', function () {
        // Figures
        var fig_field_1 = element(by.id('param1')),
            fig_field_2 = element(by.id('param2')),
            fig_field_3 = element(by.id('param3')),
            fig_field_4 = element(by.id('param4')),
            fig_field_5 = element(by.id('param5')),
            fig_field_6 = element(by.id('adjustment'));

        // Revenue
        var rev_field_1 = element(by.id('param6')),
            rev_field_2 = element(by.id('param7')),
            rev_field_3 = element(by.id('param8')),
            rev_field_4 = element(by.id('param10')),
            rev_field_5 = element(by.id('param9'));

        // Services
        var ser_op_1_Off = element(by.id('op1Off')),
            ser_op_1_On = element(by.id('op1On')),
            ser_op_2_Off = element(by.id('op2Off')),
            ser_op_2_On = element(by.id('op2On')),
            ser_op_3_Off = element(by.id('op3Off')),
            ser_op_3_On = element(by.id('op3On')),
            ser_op_4_Off = element(by.id('op4Off')),
            ser_op_4_On = element(by.id('op4On')),
            ser_op_5_Off = element(by.id('op5Off')),
            ser_op_5_On = element(by.id('op5On')),
            ser_op_6_Off = element(by.id('op6Off')),
            ser_op_6_On = element(by.id('op6On')),
            ser_op_7_Off = element(by.id('op7Off')),
            ser_op_7_On = element(by.id('op7On')),
            ser_op_8_Off = element(by.id('op8Off')),
            ser_op_8_On = element(by.id('op8On')),
            ser_op_9_Off = element(by.id('op9Off')),
            ser_op_9_On = element(by.id('op9On'));

        var click_my_calculations_tab = function () {
            var tab = element(by.css('a[ui-sref="saved-calculations"]'));
            tab.click();
        };

        it('should log in, navigate and see if calculations exist', function () {
            login();
            click_my_calculations_tab();
            browser.sleep(4000);
            element.all(by.css('.saved-panels')).then(function(items){
                expect(items.length).toBeGreaterThan(0); // there should be some saved calculations
            });
        });

        xit('should log in and navigate to saved calculations', function () {
            login();
            browser.driver.get('http://hoz-calculator-dev.com/#/saved-calculations');
            browser.sleep(2000);
            click_my_calculations_tab();
            expect(browser.getLocationAbsUrl()).toBe('http://hoz-calculator-dev.com/#/saved-calculations');
        });

        xit('should show a list of saved calculations', function () {
            browser.driver.get('http://hoz-calculator-dev.com/#/saved-calculations');
            browser.sleep(2000);
            element.all(by.css('.saved-panels')).then(function(items){
                expect(items.length).toBeGreaterThan(0); // there should be some saved calculations
            });
        });

        // this is depending on an a calculation with a particular id
        // and particular values
        var info = {
            id: "-JivDxXrm0vRfYQs5lFo",
            airline: "AIRLINE: AN ADDED CALCULATION",
            opportunity: "OPPORTUNITY: VIRGIN",
            version: "VERSION: 1.0",
            currency: "CURRENCY: $ (USD)",
            annual_revenue: "$1,233,123,123,123,123.00"
        };
        var click_saved_calculation = function(){
            var calculation_view_button = element(by.css('a[href="#/saved-calculations/'+info.id+'"]'));
            calculation_view_button.click();
        };

        // change info.id above accordingly for correct id
        xit('should click into calculation', function(){
            browser.driver.get('http://hoz-calculator-dev.com/#/saved-calculations');
            browser.sleep(2000);
            click_saved_calculation();
            expect(browser.getLocationAbsUrl()).toBe('http://hoz-calculator-dev.com/#/saved-calculations/'+info.id);
        });

        xit('should show correct airline value', function(){
            browser.driver.get('http://hoz-calculator-dev.com/#/saved-calculations/'+info.id);
            browser.sleep(2000);
            var version = element(by.exactBinding('item.info.airline.code'));
            expect(version.getText()).toEqual(info.airline);
        });

        xit('should show correct opportunity value', function(){
            browser.driver.get('http://hoz-calculator-dev.com/#/saved-calculations/'+info.id);
            browser.sleep(2000);
            var expectation = element(by.exactBinding('item.info.opportunity.name'));
            expect(expectation.getText()).toEqual(info.opportunity);
        });

        xit('should show correct opportunity value', function(){
            browser.driver.get('http://hoz-calculator-dev.com/#/saved-calculations/'+info.id);
            browser.sleep(2000);
            var expectation = element(by.exactBinding('item.info.session.name'));
            expect(expectation.getText()).toEqual(info.version);
        });

        xit('should show correct currency value and symbol', function(){
            browser.driver.get('http://hoz-calculator-dev.com/#/saved-calculations/'+info.id);
            browser.sleep(2000);
            var expectation1 = element(by.exactBinding('item.info.currency.symbol'));
            expect(expectation1.getText()).toEqual(info.currency);
        });

        xit('should show correct airline annual revenue value', function(){
            browser.driver.get('http://hoz-calculator-dev.com/#/saved-calculations/'+info.id);
            browser.sleep(2000);
            var expectation1 = element(by.exactBinding('item.input.param6'));
            expect(expectation1.getText()).toEqual(info.annual_revenue);
        });

    });
});