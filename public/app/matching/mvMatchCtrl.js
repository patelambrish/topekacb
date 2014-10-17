angular.module('app').controller('mvMatchCtrl', ['$scope', '$filter', 'mvNotifier', 'Adopter',
function($scope, $filter, mvNotifier, Adopter) {
	$scope.adopterSearchResults = [];
    $scope.adopteeSearchresults = [];
    //$scope.criteria;
    $scope.currentAdoptee;
    $scope.template = {
      adopterMatchUrl: '/partials/matching/adopter-match',
      adopteeListUrl: '/partials/adopters/adoptee-list'
    };

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

  $scope.selectAdopter = function(adopter){
    $scope.adopter = Adopter.get({ _id: adopter._id });
    $scope.adopter.$promise.
      then(function(data) {
        $scope.adoptees = data.adoptees;
      });
    $scope.searchAdoptees(adopter.criteria);
  };

/*    $scope.$on('adopterSelected', function (event, result) {
        $scope.criteria = result;
        $scope.searchAdoptees($scope.criteria);
    });
*/
    $scope.getAdopteePage = function(page) {
        $scope.adopteePage.current = page;
        $scope.searchAdoptees($scope.criteria);
    }

    $scope.$on('adopteeSelected', function(event, result){
        $scope.currentAdoptee = result;
    });

}]);