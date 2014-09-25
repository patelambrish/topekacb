angular.module('app').controller('mvAdopteeDetailCtrl', function($scope, mvCachedAdoptees, $routeParams) {
  mvCachedAdoptees.query().$promise.then(function(collection) {
    collection.forEach(function(adoptee) {
      if(adoptee._id === $routeParams.id) {
        $scope.adoptee = adoptee;
        $scope.genders = [
              {name:'Male'},
              {name:'Female'}
          ];
      }
    })
  })
});