describe('Auth', function () {

    beforeEach(function () {
        browser.get('http://hoz-calculator-dev.com/#/auth');
    });

    var email = element(by.id('email'));
    var pword = element(by.id('pword'));
    var sign_in = element(by.id('sign-in'));
    var error_message = element(by.binding('message'));

    it('should not sign in', function () {
        email.clear().sendKeys('mike@smswmedia.com');
        pword.clear().sendKeys('wrong_password');
        sign_in.click();

        expect(error_message.is()).toBe(true);
    });

    it('should toggle button', function() {
        expect(element(by.css('button')).getAttribute('disabled')).toBeFalsy();
        element(by.model('checked')).click();
        expect(element(by.css('button')).getAttribute('disabled')).toBeTruthy();
    });

});