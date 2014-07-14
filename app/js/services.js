/**
 * Created by michaelwatts
 * Date: 24/06/2014
 * Time: 10:22
 */

'use strict';

/* Services */

angular.module('myApp.services', []).
  /* Information factory to build user and session objects */
    factory('InfoFctry',function (localStorageService) {
      return {
        info: localStorageService.get('info')
            ? localStorageService.get('info')
            : {}
      }
    }).

  /* Init factory for chart objects */
    factory('ChartInitFctry',function (localStorageService) {
      return {
        "cal"   : localStorageService.get('cal')
            ? localStorageService.get('cal')
            : {
          "services"  : {},
          "param1"    : 6500000,
          "param2"    : 3,
          "param3"    : 3611111,
          "param4"    : 10,
          "param5"    : 7,
          "param6"    : 2500000000,
          "param7"    : 2565000000,
          "param8"    : 15,
          "param9"    : 100,
          "param10"   : 34,
          "adjustment": 1000000
        },
        "colors": function () {
          {
            return angular.forEach(Highcharts.getOptions().colors, function (value, key) {
              key : value[key];
            })
          }
        }
      }
    }).

    factory('ChartDraw',function (ChartData) {
      return {

        numbers: {},
        title  : "",

        setValue: function (val) {
          if (val === 'high') {
            this.numbers = ChartData.summary.high;
          } else {
            this.numbers = ChartData.summary.low
          }
        },

        chartConfig: {
          options: {
            chart      : {
              type               : 'pie',
              backgroundColor    : 'rgba(255, 255, 255, 0)',
              plotBackgroundColor: 'rgba(255, 255, 255, 0)'
            },
            tooltip    : {
              pointFormat: '<b>{point.y}</b>'
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
                center          : ['50%', '40%'],
                size            : 220
              }
            }
          },
          series : [
            {
              name     : this.title,
              innerSize: '20%',
              data     : this.numbers
            }
          ],
          title  : {
            text         : this.title,
            style        : {
              'color': '#333'
            },
            align        : 'center',
            verticalAlign: 'middle',
            y            : 110
          }
        },

        chartConfigBar: {
          options: {
            chart: {
              type               : 'bar',
              backgroundColor    : 'rgba(255, 255, 255, 0)',
              plotBackgroundColor: 'rgba(255, 255, 255, 0)'
            }
          },
          title  : {
            text: ''
          },
          credits: {
            enabled: false
          },
          series : [
            {
              name: 'High',
              data: []
            }
          ],
          xAxis  : {
            categories   : [
              'Revenue Integrity',
              'RI Process Improvement',
              'Channel Shift',
              'Ancillary Sales',
              'CMAP',
              'O & D',
              'POS',
              'ARR',
              'Insight'
            ],
            allowDecimals: false,
            title        : {
              text: 'Value'
            }
          },
          yAxis  : {
            min   : 0,
            labels: {
              overflow: 'justify'
            }
          },
          tooltip: {
            formatter: function () {
              return '<b>' + this.series.name + '</b><br/>' +
                  this.point.y + ' ' + this.point.name.toLowerCase();
            }
          }
        },

        chartConfigPie: {
          options: {
            chart: {
              type               : 'pie',
              backgroundColor    : 'rgba(255, 255, 255, 0)',
              plotBackgroundColor: 'rgba(255, 255, 255, 0)'
            },
            plotOptions: {
              series: {
                animation: true
              },
              pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                  crop: true,
                  enabled: true,
                  formatter: function() {
                    if (this.y != 0) {
                      return '<b>' + this.point.name + '</b>:' + Math.round(this.point.percentage) + '%';
                    } else {
                      return null;
                    }
                  },
                  style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                  }
                }
              }
            },
            tooltip: {
              pointFormat: '<b>{point.y}</b>'
            }
          },
          title  : {
            text: null
          },
          credits: {
            enabled: false
          },
          series : [
            {
              name: 'High',
              data: []
            }
          ],
          xAxis  : {
            categories   : [
              'Revenue Integrity',
              'RI Process Improvement',
              'Channel Shift',
              'Ancillary Sales',
              'CMAP',
              'O & D',
              'POS',
              'ARR',
              'Insight'
            ],
            allowDecimals: false,
            title        : {
              text: 'Value'
            }
          },
          yAxis  : {
            min   : 0,
            labels: {
              overflow: 'justify'
            }
          }
        }
      }
    }).

    factory('ChartData',function (localStorageService) {
      return {
        summary: localStorageService.get('summary')
            ? localStorageService.get('summary')
            : {
          high: {
            revenue_integrity                    : 0,
            revenue_integrity_process_improvement: 0,
            channel_shift                        : 0,
            ancillary_sales                      : 0,
            cmap                                 : 0,
            o_and_d                              : 0,
            pos                                  : 0,
            arr                                  : 0,
            insight                              : 0
          },
          low : {
            revenue_integrity                    : 0,
            revenue_integrity_process_improvement: 0,
            channel_shift                        : 0,
            ancillary_sales                      : 0,
            cmap                                 : 0,
            o_and_d                              : 0,
            pos                                  : 0,
            arr                                  : 0,
            insight                              : 0
          }
        }
      }
    }).

  /* Firebase */
    factory("FbService", ["$firebase", function ($firebase) {
      var ref = new Firebase("https://luminous-fire-1327.firebaseio.com/sita");
      return $firebase(ref);
    }]).

  /* Firebase 2 */
    factory("FbService2", ["$firebase", function ($firebase) {
      var ref = new Firebase("https://luminous-fire-1327.firebaseio.com/text");
      return $firebase(ref);
    }]);