angular.module('app').directive('adopterSearch', ['mvAdopter','$filter',
function(mvAdopter, $filter) {
	return {
		templateUrl : '/partials/matching/directives/adopterSearch/adopterSearch',
		restrict: 'A',
		controller: ['$scope', function($scope) {
			console.log($scope.results);
			$scope.filter = {};
			mvAdopter.enums({ _id: 0 }).$promise.then(function(data) {
				$scope.enums = data;
			});
			$scope.search = function() {
				mvAdopter.query({
					filter: $scope.filter
				}).$promise.then(function(data){
					$scope.searchResults = data;
				});
			};
		}]
	};
}]);