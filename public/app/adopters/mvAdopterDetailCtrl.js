/**
 * Created by Susan on 8/19/2014.
 */
angular.module('app').
	controller('mvAdopterDetailCtrl', function($scope, $routeParams, mvAdopter) {
    $scope.enums = mvAdopter.enums({ _id: $routeParams.id });

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
    
    $scope.deletePhone = function(phone) {
      var array = $scope.adopter.phones,
          index = angular.isArray(array) ? array.indexOf(phone) : -1;
          
      if(index !== -1) {
        array.splice(index, 1);
      }
    };
    
    $scope.addPhone = function() {
      var array = $scope.adopter.phones;
      
      if(!angular.isArray(array)) {
        array = ($scope.adopter.phones = []);
      }
      
      array.push({ name: $scope.enums.phone[0] });
    };
    
    $scope.setNotify = function(n) {
      var array = $scope.adopter.notification,
          index;
          
      if(!angular.isArray(array)) {
        array = ($scope.adopter.notification = []);
      }
      
      index = array.indexOf(n);

      if(index === -1) {
        array.push(n);
      } else {
        array.splice(index, 1);
      }
    };
	});