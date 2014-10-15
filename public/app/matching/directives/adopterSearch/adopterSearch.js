angular.module('app').directive('adopterSearch', ['mvAdopter', '$filter',
function(mvAdopter, $filter) {
	return {
		templateUrl : '/partials/matching/directives/adopterSearch/adopterSearch',
		restrict : 'A',
		controller : ['$scope',
		function($scope) {
			//default page size
			$scope.adopterPage = {
				current : 1,
				total : 1,
				previous : 1,
				next : 1,
				size : 3
			};
			$scope.adopterFilter = {};
			// mvAdopter.enums({
			// 	_id : 0
			// }).$promise.then(function(data) {
			// 	$scope.adopterEnums = data;
			// });
			$scope.searchAdopters = function() {
				mvAdopter.query({
					filter : $scope.adopterFilter,
					sort : $scope.adopterSort.value,
					start : ($scope.adopterPage.current * $scope.adopterPage.size) - $scope.adopterPage.size,
					limit : $scope.adopterPage.size
				}).$promise.then(function(res) {
					$scope.adopterSearchResults = res;
					//console.log($scope.adopterSearchResults);
					$scope.applyPage($scope.adopterPage.current, $scope.adopterSearchResults, $scope.adopterPage);
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
				$scope.getAdopterPage(1);
			};
			$scope.getAdopterPage(1);
		}]

	};
}]);

angular.module('app').directive('adopterMatchResults', ['mvAdopter','$filter',
function(mvAdopter, $filter) {
	return {
		templateUrl : '/partials/matching/directives/adopterSearch/adopterSearchResults',
		restrict: 'A',
		controller: ['$scope', function($scope) {
            // $scope.selectAdopter = function(adopter){
            //     $scope.$emit('adopterSelected', adopter.criteria);
            // }
		}]
	};
}]);