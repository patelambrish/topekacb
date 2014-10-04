angular.module('app').controller('mvAdopteeDetailCtrl', function($scope, mvAdoptee, mvAdopteeApplicationCounter, $routeParams,  mvNotifier, $location) {
    $scope.genders = ['Male','Female'];
    $scope.clothingSizeTypes = ['A', 'J', 'C'];
    $scope.shoeSizeTypes = ['A', 'C'];
    $scope.languages = ['','Spanish','Spanish/English spoken by'];
    $scope.adopteeTitle = '';
    if($routeParams.id !== '0') {
        $scope.adoptee = mvAdoptee.get({ _id: $routeParams.id });
    }
    else {
      $scope.adoptee = new mvAdoptee({
        householdMembers: []
      });
      $scope.adopteeTitle = 'New Adoptee';
    }

    $scope.update = function(){
      var adoptee = $scope.adoptee;
      mvAdopteeApplicationCounter.getNextSequence().$promise.then(function(retVal){
        if (retVal.error){
          mvNotifier.error(retVal.error);
        }
        else{
          adoptee.applicationNumber = retVal.seq;
          mvAdoptee.updateAdoptee(adoptee).$promise.then(function(retVal) {
          if (retVal.error){
            mvNotifier.error(retVal.error);
          }
          else{
            mvNotifier.notify(retVal.message);
            $location.path('/adoptees');
          }
        });
       }
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
  
    $scope.deleteHouseholdMember = function(householdMember){
      var adoptee = $scope.adoptee;
      var i = adoptee.householdMembers.indexOf(householdMember);
      if (i != -1)
      {
        adoptee.householdMembers.splice(i,1);
      }
    };

});