angular.module('app').controller('mvMatchCtrl', ['$scope', '$filter', 'mvNotifier',
function($scope, $filter, mvNotifier) {
	$scope.adopterSearchResults = [];
    $scope.adopteeSearchresults = [];
    $scope.currentAdopter;
    $scope.currentAdoptee;

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

    $scope.getAdopteePage = function(page) {
        $scope.adopteePage.current = page;
        if ($scope.currentAdopter) {
            $scope.searchAdoptees($scope.currentAdopter.criteria);
        }
    }

    $scope.selectAdoptee = function(adoptee){
        $scope.currentAdoptee = adoptee;
    }

    $scope.selectAdopter = function(adopter){
        $scope.currentAdopter = adopter;
        $scope.searchAdoptees(adopter.criteria);
    }

}]);