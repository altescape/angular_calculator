/**
 * Created by michaelwatts on 21/06/2014.
 */

var app = angular.module('myApp', ['highcharts-ng', 'LocalStorageModule']);

app.controller('UserCtrl', function ($scope, localStorageService) {
  /* Check user data */
  $scope.user = localStorageService.get('user') || {};
  $scope.user.name = localStorageService.get('user') && localStorageService.get('user').name
      ? localStorageService.get('user').name
      : "";

  $scope.updateUser = function () {
    localStorageService.set('user', $scope.user);
  };
});

app.controller('SessionCtrl', function ($scope, localStorageService) {
  /* Check session data */
  $scope.session = localStorageService.get('session') || {};
  $scope.session.name = localStorageService.get('session') && localStorageService.get('session').name
      ? localStorageService.get('session').name
      : "";

  $scope.updateSession = function () {
    localStorageService.set('session', $scope.session);
  };
});

app.controller('InfoCtrl', function ($scope, localStorageService) {
  /* Check user data */
  $scope.user = localStorageService.get('user') || {};
  $scope.user.name = localStorageService.get('user') && localStorageService.get('user').name
      ? localStorageService.get('user').name
      : "";

  /* Check session data */
  $scope.session = localStorageService.get('session') || {};
  $scope.session.name = localStorageService.get('session') && localStorageService.get('session').name
      ? localStorageService.get('session').name
      : "";
});

app.controller('ChartCtrl', function ($scope, localStorageService) {

  $scope.cal = {};
  $scope.cal.param1 = 50;
  $scope.cal.param2 = 50;
  $scope.cal.param3 = 0;
  $scope.cal.param4 = 0;

  $scope.colors = {};


  $scope.toggleLoading = function () {
    this.chartConfig.loading = !this.chartConfig.loading;
  };

  $scope.loadData = [
    ['Firefox', $scope.cal.param1],
    ['IE', $scope.cal.param2],
    ['Chrome', $scope.cal.param3],
    ['Safari', $scope.cal.param4]
  ];

  $scope.updateSession = function () {
    localStorageService.set('session', $scope.session);
  };

  $scope.updateChart = function () {

    localStorageService.set('cal', $scope.cal);

    var seriesArray = $scope.chartConfig.series[0];
    var seriesArray2 = $scope.chartConfig2.series[0];
    var newData = [
      ['Firefox', $scope.cal.param1],
      ['IE', $scope.cal.param2],
      ['Chrome', $scope.cal.param3],
      ['Safari', $scope.cal.param4]
    ];
    var newData2 = [
      ['Firefox', $scope.cal.param1 + 122],
      ['IE', $scope.cal.param2 + 15],
      ['Chrome', $scope.cal.param3 + 36],
      ['Safari', $scope.cal.param4 + 140]
    ];
    seriesArray.data = newData;
    seriesArray2.data = newData2;

    $scope.colors = {
      1: Highcharts.getOptions().colors[0],
      2: Highcharts.getOptions().colors[1],
      3: Highcharts.getOptions().colors[2],
      4: Highcharts.getOptions().colors[3]
    };
  };

  /* Start Highcharts config */
  $scope.chartConfig = {
    options: {
      chart      : {
        type               : 'pie',
        backgroundColor    : 'rgba(255, 255, 255, 0)',
        plotBackgroundColor: 'rgba(255, 255, 255, 0)'
      },
      tooltip    : {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        series: {
          tooltip  : {
            followPointer: false
          },
          animation: true
        },
        pie   : {
          allowPointSelect: true,
          cursor          : 'pointer',
          borderColor     : 'rgba(255, 255, 255, 0)',
          dataLabels      : {
            enabled: false
          },
          center          : ['50%', '50%']
        }
      }
    },
    series : [
      {
        name     : 'Browser share',
        innerSize: '20%',
        data     : $scope.loadData
      }
    ],
    title  : {
      text         : $scope.param1 + $scope.param2 + $scope.param3 + $scope.param4,
      style        : {
        'color': '#333'
      },
      align        : 'center',
      verticalAlign: 'middle',
      y            : 100
    }
  };
  /* End Highcharts config */

  /* Start Highcharts config */
  $scope.chartConfig2 = {
    options: {
      chart      : {
        type               : 'pie',
        backgroundColor    : 'rgba(255, 255, 255, 0)',
        plotBackgroundColor: 'rgba(255, 255, 255, 0)'
      },
      tooltip    : {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        series: {
          tooltip  : {
            followPointer: false
          },
          animation: true
        },
        pie   : {
          allowPointSelect: true,
          cursor          : 'pointer',
          borderColor     : 'rgba(255, 255, 255, 0)',
          dataLabels      : {
            enabled: false
          },
          center          : ['50%', '50%']
        }
      }
    },
    series : [
      {
        name     : 'Browser share',
        innerSize: '20%',
        data     : $scope.loadData
      }
    ],
    title  : {
      text         : $scope.param1 + $scope.param2,
      style        : {
        'color': '#333'
      },
      align        : 'center',
      verticalAlign: 'middle',
      y            : 100
    }
  };
  /* End Highcharts config */
});