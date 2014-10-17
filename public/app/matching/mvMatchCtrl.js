angular.module('app').controller('mvMatchCtrl', ['$scope', '$filter', 'mvNotifier', 'adoptee', 'mvAdopter',
function($scope, $filter, mvNotifier, adoptee, mvAdopter) {
    $scope.adopterSearchResults = [];
    $scope.adopteeSearchResults = [];
    $scope.currentAdopter;
    $scope.currentAdoptee;
    $scope.ageRanges = ["0-7", "8-12", "13-18"];
    $scope.adopteeEnums;
    $scope.adopteeAges = [];

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

    $scope.selectAdoptee = function(selectedAdoptee) {
      $scope.currentAdoptee = selectedAdoptee;
      $scope.adopteeAges = [];
      selectedAdoptee.householdMembers.forEach(function(member){
          if (member.age < 8 && $scope.adopteeAges.indexOf($scope.ageRanges[0]) == -1){
              $scope.adopteeAges.push($scope.ageRanges[0]);
          }
          if (member.age > 7 && member.age < 13 && $scope.adopteeAges.indexOf($scope.ageRanges[1]) == -1) {
              $scope.adopteeAges.push($scope.ageRanges[1]);
          }
          if (member.age > 12 && member.age < 19 && $scope.adopteeAges.indexOf($scope.ageRanges[2]) == -1){
              $scope.adopteeAges.push($scope.ageRanges[2]);
          }
      });
    }

    $scope.matchAdoptee = function(){
      $scope.currentAdoptee.status = "Matched";
      $scope.currentAdoptee._adopterId = $scope.currentAdopter._id;
      if (!$scope.currentAdopter.adoptees){
          $scope.currentAdopter.adoptees = [];
      }
      $scope.currentAdopter.adoptees.push($scope.currentAdoptee._id);
      console.log($scope.currentAdoptee);
      adoptee.updateAdoptee($scope.currentAdoptee).$promise.then(function (retVal) {
          if (retVal.error) {
              mvNotifier.notify(retVal.error);
          }
          else {
              mvAdopter.save($scope.currentAdopter).$promise.then(function(retVal){
                  if (retVal.error) {
                      mvNotifier.notify(retVal.error);
                  }
                  else{
                      mvNotifier.notify($scope.currentAdoptee.firstName + ' ' + $scope.currentAdoptee.lastName + ' matched!');
                  }
              });
          }
      });
      $scope.searchAdoptees($scope.currentAdopter.criteria);
    }

    $scope.selectAdopter = function(adopter){
      $scope.currentAdopter = adopter;
      $scope.searchAdoptees(adopter.criteria);
    }
    
}]);