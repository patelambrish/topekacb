angular.module('app').controller('mvMainCtrl', ['$scope', 'mvNotifier', 'mvSharedContext', 'mvIdentity', 'MessageService','ChartService', 'BarChartService',
function($scope, mvNotifier, mvSharedContext, mvIdentity, MessageService,ChartService,BarChartService) {
	$scope.identity = mvIdentity;
	$scope.message = MessageService.get({type:'HomePageMessage'});
	$scope.updateMessage = function() {
		$scope.message.$update().then(function(data){
			$scope.message = data;
			mvNotifier.notify('Message updated successfully!');
		});
	};
	if (mvSharedContext.message()) {
		mvNotifier.notify(mvSharedContext.message());
		mvSharedContext.clearContext();
	}
	$scope.chart = {
		"type" : "ColumnChart",
		/*"data" : {
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
			"rows" : [{
				"c" : [{
					"v" : ""
				}, {
					"v" : 2500
				}, {
					"v" : 1500
				}]
			}]
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
		},*/
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
	};
	$scope.household = {
		"type" : "PieChart",
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

	 ChartService.get().$promise.then(function(data){
	 	var chartArray = [];
	 	var chartItem = ["Household Types", "Count"];
	 	chartArray.push(chartItem);
	 	angular.forEach(data,function(item){
	 		chartItem = [item._id,item.count];
	 		chartArray.push(chartItem);
	 	});

	  //console.log(chartArray);
	  $scope.household.data = chartArray;
	 });

	 BarChartService.get().$promise.then(function(data){
	 	var matched = 0;
	 	var notmatched = 0;
	 	angular.forEach(data,function(item){
	 		if(item._id == "Matched"){
	 			matched = item.count;
	 		}else{
	 			notmatched = notmatched + item.count;
	 		}
	 	});

	 	console.log("Matched :"+matched+"  Not Matched:"+notmatched);
	 	 $scope.chart.data = {
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
			"rows" : [{
				"c" : [{
					"v" : ""
				}, {
					"v" : matched
				}, {
					"v" : notmatched
				}]
			}]
		};
	 });

}]);
