angular.module('app').controller('mvMainCtrl', function($scope, mvCachedAdoptees) {
  $scope.adoptees = mvCachedAdoptees.query();
});