exports.config = {
    chromeDriver: './selenium/chromedriver',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
        //'spec/*_spec.js',
        //'spec/auth_spec.js',
        'spec/info_spec.js',
    ],
    baseUrl: 'http://hoz-calculator-dev.com',
    rootElement: 'html',
    allScriptsTimeout: 11000,
    getPageTimeout: 10000,
    beforeLaunch: function() {},
    onPrepare: function() {},
    onComplete: function() {},
    onCleanUp: function(exitCode) {},
    afterLaunch: function() {},
    params: {
        login: {
            user: 'info@smswmedia.com',
            password: 'password'
        }
    },
    framework: 'jasmine',
    jasmineNodeOpts: {
        isVerbose: false,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 30000
    }
};