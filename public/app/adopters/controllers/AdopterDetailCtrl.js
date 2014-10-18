angular.module('app').
	controller('AdopterDetailCtrl', function($scope, $routeParams, $location, Adopter, cachedAdopters, mvNotifier, common) {
    $scope.template = {
      adopteeListUrl: '/partials/adopters/adoptee-list'
    };

    $scope.busy = function() {
      return $scope.adopter && $scope.adopter.$promise && !$scope.adopter.$resolved;
    };

    $scope.create = function() {
      $scope.submitted = false;
      $scope.adopter = new Adopter({
        entity: 'Individual',
        address: {
          city: 'Topeka',
          state: 'KS'
        },
        phones: [{ name: 'Home' }],
        adoptees: [],
        enums: cachedAdopters.enums(),
        notifyMethods: [],
        criteria: {
          childAges: [],
          households: [],
          special: []
        }
      });

      $scope.master = angular.copy($scope.adopter);
      $scope.adoptees = $scope.master.adoptees;
    };

    $scope.get = function() {
      $scope.submitted = false;
      $scope.adopter = Adopter.get({ _id: $routeParams.id });
      $scope.adopter.$promise.
        then(function(data) {
          $scope.master = angular.copy(data);
          $scope.adoptees = $scope.master.adoptees;
        });
    };

    $scope.save = function(form, plus) {
      $scope.submitted = true;

      if(form.$valid) {
        Adopter.save($scope.adopter, function() {
          mvNotifier.notify($scope.adopter.name + ' successfully saved!');
          
          if(plus) {
            $location.path('/adopters/0');
            $scope.create();
            form.$setPristine();
          } else {
            $location.path('/adopters');
          }
        });
      }
    };

    $scope.delete = function() {
      Adopter.remove({ _id: $scope.adopter._id }, function() {
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