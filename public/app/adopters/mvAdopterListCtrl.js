/**
 * Created by Susan on 8/19/2014.
 */
angular.module('app').controller('mvAdopterListCtrl', function($scope, mvCachedAdopters) {
    $scope.adopters = mvCachedAdopters.query();

    $scope.sortOptions = [{value:"name",text: "Sort by Name"},
        {value: "enrolled",text: "Sort by Enroll Date"}];
    $scope.sortOrder = $scope.sortOptions[0].value;
});