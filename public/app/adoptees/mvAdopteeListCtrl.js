angular.module('app').controller('mvAdopteeListCtrl', function($scope, mvCachedAdoptees) {
  $scope.adoptees = mvCachedAdoptees.query();

  $scope.sortOptions = [{value:"name",text: "Sort by Name"},
    {value: "created",text: "Sort by Create Date"}];
  $scope.sortOrder = $scope.sortOptions[0].value;
});