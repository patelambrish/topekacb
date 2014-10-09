angular.module('app').controller('mvMatchCtrl', ['$scope', '$filter','mvNotifier',
function($scope, $filter, mvNotifier) {
	$scope.showAdopterSearchResults = false;
	
	$scope.select = function(adopter){
	   $scope.showAdopterSearchResults = true;
	}
}]);