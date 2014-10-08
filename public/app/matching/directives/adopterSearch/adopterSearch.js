angular.module('app').directive('adopterSearch', ['mvAdopter', '$filter',
function(mvAdopter, $filter) {
	return {
		templateUrl : '/partials/matching/directives/adopterSearch/adopterSearch',
		restrict : 'A',
		controller : ['$scope',
		function($scope) {
			//default page size
			$scope.adopterLimit = 10;
			$scope.adopterStart = 1;
			$scope.adopterFilter = {};
			mvAdopter.enums({
				_id : 0
			}).$promise.then(function(data) {
				$scope.adopterEnums = data;
			});
			$scope.searchAdopters = function() {
				mvAdopter.query({
					filter : $scope.adopterFilter,
					sort : $scope.adopterSort.value,
					start : $scope.adopterStart,
					limit : $scope.adopterLimit
				}).$promise.then(function(data) {
					$scope.adopterSearchResults = data.data;
				});
			};
			$scope.adopterSort = {
				value : 'name',
				text : 'Name: A to Z',
				options : [{
					value : 'name',
					text : 'Name: A to Z'
				}, {
					value : '-name',
					text : 'Name: Z to A'
				}, {
					value : 'org',
					text : 'Organization: A to Z'
				}, {
					value : '-org',
					text : 'Organization: Z to A'
				}, {
					value : '-criteria.count',
					text : '# of households - High to Low'
				}, {
					value : 'criteria.count',
					text : '# of households - Low to High'
				}]
			};
			$scope.applyAdopterSort = function(sortOption) {
				angular.extend($scope.adopterSort, sortOption);
				$scope.adopterStart = 1;
				$scope.searchAdopters();
			};
		}]

	};
}]);