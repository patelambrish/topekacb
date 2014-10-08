angular.module('app').
	controller('mvAdopterDetailCtrl', function($scope, $routeParams, $location, mvAdopter, mvIdentity, mvNotifier, common) {
    $scope.enums = mvAdopter.enums({ _id: $routeParams.id });
    $scope.permission = {
      delete: mvIdentity.isAuthorized('manager')
    };

    $scope.busy = function() {
      return $scope.adopter && $scope.adopter.$promise && !$scope.adopter.$resolved;
    };

    $scope.create = function() {
      $scope.submitted = false;
      $scope.adopter = new mvAdopter({
        phones: [{ name: 'Home' }],
        notifyMethods: [],
        criteria: {
          childAges: [],
          households: [],
          special: []
        }
      });

      $scope.master = angular.copy($scope.adopter);
    };

    $scope.get = function() {
      $scope.submitted = false;
      $scope.adopter = mvAdopter.get({ _id: $routeParams.id });
      $scope.adopter.$promise.
        then(function(data) {
          $scope.master = angular.copy(data);
        });
    };

    $scope.save = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        mvAdopter.save($scope.adopter, function() {
          mvNotifier.notify($scope.adopter.name + ' successfully saved!');
          $location.path('/adopters');
        });
      }
    };

    $scope.savePlus = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        mvAdopter.save($scope.adopter, function() {
          mvNotifier.notify($scope.adopter.name + ' successfully saved!');
          $location.path('/adopters/0');
          $scope.create();
        });
      }
    };

    $scope.delete = function() {
      mvAdopter.remove({ _id: $scope.adopter._id }, function() {
        mvNotifier.notify($scope.adopter.name + ' was deleted.');
        $location.path('/adopters');
      });
    };

    $scope.cancel = function() {
      $scope.adopter = angular.copy($scope.master);
      $location.path('/adopters');
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
    
    $scope.setFlags = common.setFlags;

    ($routeParams.id === '0' ? $scope.create : $scope.get)();
	});