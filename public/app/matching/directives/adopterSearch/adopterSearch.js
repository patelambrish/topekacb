angular.module('app').directive('adopterSearch', ['mvAdopter', '$filter',
function(mvAdopter, $filter) {
	return {
		templateUrl : '/partials/matching/directives/adopterSearch/adopterSearch',
		restrict : 'A',
		controller : ['$scope',
		function($scope) {
			//default page size
			$scope.limit = 10;
			$scope.start = 1;
			$scope.filter = {};
			mvAdopter.enums({
				_id : 0
			}).$promise.then(function(data) {
				$scope.enums = data;
			});
			$scope.search = function() {
				mvAdopter.query({
					filter : $scope.filter,
					sort : $scope.sort.value,
					start : $scope.start,
					limit : $scope.limit
				}).$promise.then(function(data) {
					console.log(data);
					$scope.searchResults = data.data;
				});
			};
			$scope.sort = {
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
			$scope.applySort = function(sortOption) {
				angular.extend($scope.sort, sortOption);
				$scope.start = 1;
				$scope.search();
			};
		}]

	};
}]);