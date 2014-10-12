angular.module('app').controller('mvMainCtrl', ['$scope', '$http', 'mvNotifier', 'mvSharedContext', 'mvIdentity', 'MessageService', 'ChartService', 'BarChartService',
function($scope, $http, mvNotifier, mvSharedContext, mvIdentity, MessageService, ChartService, BarChartService) {
  var barChart = {
    type: 'ColumnChart',
    displayed: true,
    data: {
      cols: [{
        id: 'current',
        label: '',
        type: 'string',
        p: {}
      }, {
        id: 'adopted',
        label: 'Already Adopted',
        type: 'number',
        p: {}
      }, {
        id: 'not-adopted',
        label: 'Not Yet Adopted',
        type: 'number',
        p: {}
      }],
      rows : []
    },
    formatters: {
      number: [{
        columnNum: 1,
        pattern: '#,##0'
      }, {
        columnNum: 2,
        pattern: '#,##0'
      }]
    },
    options: {
      axisTitlesPosition: 'none',
      backgroundColor: 'transparent',
      colors: ['#1EA942','#E23D28'],
      displayExactValues: true,
      fontName: 'Helvetica',
      isStacked: 'true',
      legend: null,
      chartArea: {
        height: '95%',
        width: '80'
      },
      vAxis: {
        gridlines: {
          count: 6
        }
      }
    }
  }, pieChart = {
    type: 'PieChart',
    displayed: true,
    formatters: {
      number: [{
        columnNum: 1,
        pattern: '#,###'
      }]
    },
    options: {
      backgroundColor: 'transparent',
      colors: ['#00529B','#3491D8','#A3D4F7', '#D6EEFF', '#FDB641', '#FCC976', '#FCE0B3','#FFEED6'],
      displayExactValues: true,
      fontName: 'Helvetica',
      is3D: true,
      chartArea: {
        height: '95%',
        width: '100%'
      }
    }
  };

  $scope.identity = mvIdentity;
  $scope.message = MessageService.get({
    type : 'HomePageMessage'
  });
  $scope.updateMessage = function() {
    $scope.message.$update().then(function(data) {
      $scope.message = data;
      mvNotifier.notify('Message updated successfully!');
    });
  };
  if (mvSharedContext.message()) {
    mvNotifier.notify(mvSharedContext.message());
    mvSharedContext.clearContext();
  }

  $http.get('/api/stats/specialNeeds').
    then(function(data) {
      var chartArray = [],
          collection = data.data;

      chartArray = collection.map(function(item) {
        return [item._id, item.count];
      });
      chartArray.unshift(['Special Needs', 'Households']);

      pieChart.data = chartArray; console.log(chartArray);
      $scope.householdChart = pieChart;
    });

  // ChartService.get().$promise.then(function(data) {
  //   var chartArray = [], chartItem = ["Household Types", "Count"];
  //   chartArray.push(chartItem);
  //   angular.forEach(data, function(item) {
  //     chartItem = [item._id, item.count];
  //     chartArray.push(chartItem);
  //   });

  //   pieChart.data = chartArray;
  //   $scope.householdChart = pieChart;
  // });

  BarChartService.get().$promise.then(function(data) {
    var matched = 0, notmatched = 0;
    angular.forEach(data, function(item) {
      if (item._id == "Matched") {
        matched = item.count;
      } else {
        notmatched = notmatched + item.count;
      }
    });

    //console.log("Matched :"+matched+"  Not Matched:"+notmatched);
    barChart.data.rows = [{
      "c" : [{
        "v" : ""
      }, {
        "v" : matched
      }, {
        "v" : notmatched
      }]
    }];
    $scope.adoptionChart = barChart;

  });

}]);
