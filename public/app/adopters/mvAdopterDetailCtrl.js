/**
 * Created by Susan on 8/19/2014.
 */
angular.module('app').
	controller('mvAdopterDetailCtrl', function($scope, $routeParams, mvAdopter) {
    if($routeParams.id) {
      $scope.adopter = mvAdopter.get({ _id: $routeParams.id });
    } else {
      $scope.adopter = new mvAdopter();
    }
	});