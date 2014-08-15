angular.module('app').controller('mvAdopteeListCtrl', function($scope, mvCachedAdoptees) {
  $scope.adoptees = mvCachedAdoptees.query();

  $scope.sortOptions = [{value:"name",text: "Sort by Name"},
    {value: "enrolled",text: "Sort by Enroll Date"}];
  $scope.sortOrder = $scope.sortOptions[0].value;
});