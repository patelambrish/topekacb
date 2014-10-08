angular.module('app').controller('mvAdopteeDetailCtrl', function($scope, mvAdoptee, mvAdopteeApplicationCounter, $routeParams,  mvNotifier, $location, $filter) {
    $scope.genders = ['Male','Female'];
    $scope.clothingSizeTypes = ['A', 'J', 'C'];
    $scope.shoeSizeTypes = ['A', 'C'];
    $scope.languages = ['','Spanish','Spanish/English spoken by'];
    $scope.adopteeTitle = '';
    $scope.site = '';

    $scope.setNewAdoptee = function(){
        $scope.adoptee = new mvAdoptee({
            householdMembers: [],
            address: {city: 'Topeka'}
        });
        $scope.adopteeTitle = 'New Adoptee';
    }

    if($routeParams.id !== '0') {
        mvAdoptee.get({ _id: $routeParams.id }).$promise.then(function(retVal){
          if (retVal.error){
            mvNotifier.notify(retVal.error);
          }
          else{
            $scope.adoptee = retVal;
            $scope.adoptee.birthDate = $filter('date')($scope.adoptee.birthDate, 'yyyy-MM-dd');
          }
         });
    }
    else {
        $scope.setNewAdoptee();
    }

    $scope.update = function(newFlag){
      $scope.newFlag = newFlag;
      console.log($scope.testDate);
      var adoptee = $scope.adoptee;
      if (adoptee.applicationNumber)
      {
            $scope.adopteeUpdate();
      } else {
          mvAdopteeApplicationCounter.getNextSequence().$promise.then(function (retVal) {
              if (retVal.error) {
                  mvNotifier.notify(retVal.error);
              }
              else {
                  adoptee.applicationNumber = retVal.seq;
                  adoptee.site = $scope.getCurrentSite();
                  $scope.adopteeUpdate();

              }
          });
      }
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

    $scope.saveSite = function(site){
        $scope.closeModal(site);
    };

    $scope.adopteeUpdate = function(){
        mvAdoptee.updateAdoptee($scope.adoptee).$promise.then(function (retVal) {
            if (retVal.error) {
                mvNotifier.notify(retVal.error);
            }
            else {
                mvNotifier.notify(retVal.firstName + ' ' + retVal.lastName + ' successfully saved!');
                $scope.adopteeTitle = '';
                if ($scope.newFlag) {
                    $location.path('/adoptees/0');
                    $scope.setNewAdoptee();
                }
                else{
                    $scope.adoptee = retVal;
                    $scope.adoptee.birthDate = $filter('date')($scope.adoptee.birthDate, 'yyyy-MM-dd');
                }
            }
        });
    }

});