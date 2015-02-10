'use strict';

var protractor = require('protractor');
var Firebase = require('firebase');

describe('Sita Calculator Calculator', function () {

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

        if (logged_in) { browser.driver.get('http://hoz-calculator-dev.com/#/calculator') }
        if (!logged_in) { enter_login_details() }
    };

    var enter_login_details = function () {
        browser.driver.get('http://hoz-calculator-dev.com/#/auth');
        element(by.id('email')).clear().sendKeys(browser.params.login.user);
        element(by.id('pword')).clear().sendKeys(browser.params.login.password);
        element(by.id('sign-in')).click();
        browser.sleep(2000);
    };

    var enter_info_details = function () {
        browser.driver.get('http://hoz-calculator-dev.com/#/info');

        var airline_text = element(by.id('acode')),
            opportunity_text = element(by.id('oname')),
            version_text = element(by.id('sname')),
            currency_dropdown = element(by.id('currency')),
            create_button = element(by.id('create_button')),
            update_button = element(by.id('update_button'));

        airline_text.clear().sendKeys('airline code test');
        opportunity_text.clear().sendKeys('opportunity test ');
        version_text.clear().sendKeys(Date.now());
        create_button.click();
        browser.sleep(200);
    };

    beforeEach(function () {
        browser.get('http://hoz-calculator-dev.com/index.html');
    });

    describe('calculator page', function () {
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

        it('should log in and enter info and save session', function () {
            login();
            enter_info_details();
        });

        it('should add values to Figures', function () {
            browser.driver.get('http://hoz-calculator-dev.com/#/calculator');
            fig_field_1.clear().sendKeys(6000000);
            fig_field_2.clear().sendKeys(3);
            fig_field_3.clear().sendKeys(5000000);
            fig_field_4.clear().sendKeys(2);
            fig_field_5.clear().sendKeys(7);
            fig_field_6.clear().sendKeys(100000);
        });

        it('should add values to Revenue', function () {
            browser.driver.get('http://hoz-calculator-dev.com/#/calculator');

            var tab = element(by.css('li[heading="Revenue"]'));
            tab.click();

            rev_field_1.clear().sendKeys(300000000);
            rev_field_2.clear().sendKeys(120);
            rev_field_3.clear().sendKeys(12);
            rev_field_4.clear().sendKeys(24);
            rev_field_5.clear().sendKeys(78);
        });

        it('should enable Services', function () {
            browser.driver.get('http://hoz-calculator-dev.com/#/calculator');

            var tab = element(by.css('li[heading="Services"]'));
            tab.click();

            ser_op_1_Off.click();
            ser_op_2_Off.click();
            ser_op_3_Off.click();
            ser_op_4_Off.click();
            ser_op_5_Off.click();
            ser_op_6_Off.click();
            ser_op_7_Off.click();
            ser_op_8_Off.click();
            ser_op_9_Off.click();
        });

        var click_data_tab = function () {
            var tab = element(by.css('a[ui-sref="calculator.data"]'));
            tab.click();
        };

        it('should give correct value to Revenue Integrity', function () {
            browser.driver.get('http://hoz-calculator-dev.com/#/calculator');

            click_data_tab();

            expect(element(by.binding('revenue_integrity.high')).getText()).toEqual('$90.00');
            expect(element(by.binding('revenue_integrity.low')).getText()).toEqual('$33.00');
        });

        it('should give correct value to Revenue Integrity Process Improvement', function () {
            browser.driver.get('http://hoz-calculator-dev.com/#/calculator');

            click_data_tab();

            expect(element(by.binding('revenue_integrity_process_improvement.high')).getText()).toEqual('$286.00');
            expect(element(by.binding('revenue_integrity_process_improvement.low')).getText()).toEqual('$101.00');
        });

        it('should give correct value to Channel Shift', function () {
            browser.driver.get('http://hoz-calculator-dev.com/#/calculator');

            click_data_tab();

            expect(element(by.binding('channel_shift.high')).getText()).toEqual('$8.00');
            expect(element(by.binding('channel_shift.low')).getText()).toEqual('$5.00');
        });

        it('should give correct value to Ancillary Sales', function () {
            browser.driver.get('http://hoz-calculator-dev.com/#/calculator');

            click_data_tab();

            expect(element(by.binding('ancillary_sales.high')).getText()).toEqual('$9.00');
            expect(element(by.binding('ancillary_sales.low')).getText()).toEqual('$5.00');
        });

        it('should give correct value to Weight and Balance', function () {
            browser.driver.get('http://hoz-calculator-dev.com/#/calculator');

            click_data_tab();

            expect(element(by.binding('cmap.high')).getText()).toEqual('$0.00');
            expect(element(by.binding('cmap.low')).getText()).toEqual('$0.00');
            expect(element(by.binding('cmap.fuel_cost.value')).getText()).toEqual('$29.00'); // extra test as high/low are 0
        });

        it('should give correct value to Origin and Destination', function () {
            browser.driver.get('http://hoz-calculator-dev.com/#/calculator');

            click_data_tab();

            expect(element(by.binding('origin_and_destination.high')).getText()).toEqual('$60.00');
            expect(element(by.binding('origin_and_destination.low')).getText()).toEqual('$30.00');
        });

        it('should give correct value to Point of Sale', function () {
            browser.driver.get('http://hoz-calculator-dev.com/#/calculator');

            click_data_tab();

            expect(element(by.binding('pos.high')).getText()).toEqual('$15.00');
            expect(element(by.binding('pos.low')).getText()).toEqual('$8.00');
        });

        it('should give correct value to Airfare Insight', function () {
            browser.driver.get('http://hoz-calculator-dev.com/#/calculator');

            click_data_tab();

            expect(element(by.binding('airfare_insight.high')).getText()).toEqual('$30.00');
            expect(element(by.binding('airfare_insight.low')).getText()).toEqual('$15.00');
        });

        it('should give correct value to ARR', function () {
            browser.driver.get('http://hoz-calculator-dev.com/#/calculator');

            click_data_tab();

            expect(element(by.binding('arr.high')).getText()).toEqual('$47.00');
            expect(element(by.binding('arr.low')).getText()).toEqual('$28.00');
        });
    });
});