angular.module('app').controller('mvMainCtrl', ['$scope', 'mvNotifier', 'mvSharedContext', 'mvIdentity', 'MessageService', 'ChartService', 'BarChartService',
function($scope, mvNotifier, mvSharedContext, mvIdentity, MessageService, ChartService, BarChartService) {
	var barChart = {
		"type" : "ColumnChart",
		"data" : {
			"cols" : [{
				"id" : "month",
				"label" : "",
				"type" : "string",
				"color" : 'red',
				"p" : {}
			}, {
				"id" : "adopted",
				"label" : "Adopted",
				"type" : "number",
				"color" : 'green',
				"p" : {}
			}, {
				"id" : "not-adopted",
				"label" : "Waiting Adoption",
				"type" : "number",
				"p" : {}
			}],
			rows : []
		},
		"options" : {
			"title" : "Adoptions",
			"isStacked" : "true",
			"displayExactValues" : true,
			chartArea : {
				height : "80%",
				width : "30%"
			},
			"vAxis" : {
				"title" : "Families",
				"gridlines" : {
					"count" : 6
				}
			},
			"hAxis" : {
				"title" : ""
			}
		},
		"formatters" : {
			number : [{
				columnNum : 1,
				pattern : "#,##0"
			}, {
				columnNum : 2,
				pattern : "#,##0"
			}]
		},
		"displayed" : true
	}, pieChart = {
		"type" : "PieChart",
		data : [],
		"options" : {
			title : 'Households',
			"displayExactValues" : true,
			"is3D" : true,
			chartArea : {
				height : "80%",
				width : "100%"
			}
		},
		"formatters" : {
			"number" : [{
				"columnNum" : 1,
				"pattern" : "#,###"
			}]
		},
		"displayed" : true
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

	ChartService.get().$promise.then(function(data) {
		var chartArray = [], chartItem = ["Household Types", "Count"];
		chartArray.push(chartItem);
		angular.forEach(data, function(item) {
			chartItem = [item._id, item.count];
			chartArray.push(chartItem);
		});

		pieChart.data = chartArray;
		$scope.householdChart = pieChart;
	});

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
