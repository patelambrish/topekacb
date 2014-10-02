angular.module('app').
	controller('mvAdopterDetailCtrl', function($scope, $routeParams, mvAdopter) {
    $scope.states = ['KS', 'MO', 'NE', 'OK', 'CO'];
    $scope.entityTypes = ['Individual', 'Organization', 'Deptartment'];

    if($routeParams.id !== '0') {
      $scope.adopter = mvAdopter.get({ _id: $routeParams.id });
    } else {
      $scope.adopter = new mvAdopter({
        entity: 'Individual',
        status: 'In Process',
        address:  { state: 'KS' }
      });
    }
    
    $scope.save = function() {
      $scope.adopter.$save();
    };
	});