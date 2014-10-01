angular.module('app').controller('mvAdopteeDetailCtrl', function($scope, mvAdoptee, $routeParams,  mvNotifier) {
  mvAdoptee.query().$promise.then(function(collection) {
    collection.forEach(function(adoptee) {
      if(adoptee._id === $routeParams.id) {
        $scope.adoptee = adoptee;
        $scope.genders = ['Male','Female'];
        $scope.clothingSizeTypes = ['A', 'J', 'C'];
        $scope.shoeSizeTypes = ['A', 'C'];
        $scope.languages = ['Spanish','Spanish/English spoken by'];
      }
    });
  });
  $scope.update = function(){
      var adoptee = $scope.adoptee;
      mvAdoptee.updateAdoptee(adoptee).$promise.then(function(retVal) {
          mvNotifier.notify(retVal.message);
      });
    };
  $scope.addHouseholdMember = function(){
      var adoptee = $scope.adoptee;
      if (!adoptee.householdMembers)
      {
        adoptee.householdMembers = [];
      }
      adoptee.householdMembers.push({householdMember: {}});
  };
});