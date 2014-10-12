angular.module('app').controller('mvMatchCtrl', ['$scope', '$filter', 'mvNotifier',
function($scope, $filter, mvNotifier) {
	$scope.adopterSearchResults = [];
    $scope.adopteeSearchresults = [];

	$scope.applyPage = function(page, data, pageInfo) {
      pageInfo.current = page;
      if(data && data.totalCount) {
      	pageInfo.total = Math.ceil(data.totalCount / pageInfo.size);
      }
      pageInfo.previous = page > 1 ? page - 1 : page;
      pageInfo.next = page < pageInfo.total ? page + 1 : page;

   };

	$scope.getAdopterPage = function(page) {
		$scope.adopterPage.current = page;
		$scope.searchAdopters();
	};

    $scope.$on('adopterSelected', function (event, result) {
        $scope.searchAdoptees(result);
    });

}]);