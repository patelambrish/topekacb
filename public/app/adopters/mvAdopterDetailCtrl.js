/**
 * Created by Susan on 8/19/2014.
 */
angular.module('app').
	controller('mvAdopterDetailCtrl', function($scope, $routeParams, mvAdopter) {
    $scope.states = ['KS', 'MO', 'NE', 'OK', 'CO'];
    $scope.entityTypes = ['Individual', 'Organization', 'Deptartment'];

    if($routeParams.id !== '0') {
      console.log($routeParams.id);
      $scope.adopter = mvAdopter.get({ _id: $routeParams.id });
      console.log($scope.adopter);
    } else {
      $scope.adopter = new mvAdopter({
        entity: 'Individual'
      });
    }
    
    $scope.save = function() {
      $scope.adopter.$save();
    };
	});