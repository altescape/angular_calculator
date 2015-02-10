describe('Is jasmine working', function () {
    it('should be working', function () {
        expect(true).toBe(true);
    });
});

describe('InfoCtrl', function () {

    beforeEach(angular.mock.module('myApp'));

    var ctrl, myScope, infoData;

    beforeEach(angular.mock.inject(function($controller, $rootScope, localStorageService) {
        myScope = $rootScope.$new();

        ctrl = $controller('InfoCtrl', {
            $scope: myScope
        });

        infoData = function () {
            return localStorageService.get('info') ? localStorageService.get('info') : {}
        };

        // mock objects
        myScope.info = {
            "running_session": true,
            "loggedIn": true,
            "date": {
                "timestamp": 1423221814,
                "date": "2015-02-06T11:23:34.020Z"
            },
            "currency": {
                "currency": "USD",
                "symbol": "£"
            },
            "airline": {
                "code": "Mike"
            },
            "opportunity": {
                "name": "Test"
            },
            "session": {
                "name": "123"
            }
        };
    }));

    describe('$scope.OfflineState', function () {
        it('checks for default value of down', function () {
            expect(myScope.OfflineState).toEqual('down');
        });
    });

    describe('$scope.info.currency', function () {
        it('checks for default value of currency', function () {
            myScope.setCurrency();
            expect(myScope.info.currency).toEqual({currency: 'USD', symbol: '$'});
        });
    });

    describe('$scope.setCurrency()', function () {
        it('checks changing currency value', function () {
            myScope.info.currency = {currency: 'EUR', symbol: '€'}
            expect(myScope.info.currency).toEqual({currency: 'EUR', symbol: '€'});
        });
    });
});