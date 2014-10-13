angular.module('app').
  controller('adopteeDetailCtrl', function($scope, $routeParams, $location, $filter, cbSites, cbCurrentSite, adoptee, adopteeApplicationCounter, mvNotifier, common) {
    $scope.sites = cbSites;
    $scope.enums = adoptee.enums({ _id: $routeParams.id });
    $scope.adopteeTitle = '';
    $scope.setNewAdoptee = function(){
        $scope.adoptee = new adoptee({
            site: cbCurrentSite.get(),
            householdMembers: [],
            address: {
              city: 'Topeka',
              state: 'KS'
            },
            status: 'Not Matched'
        });
        $scope.adopteeTitle = 'New Adoptee';
    };

    $scope.siteUndefined = function() {
      return $scope.adoptee && !$scope.adoptee.site;      
    };

    $scope.onsitechange = function(site) {
      $scope.adoptee.site = site;
    };

    if($routeParams.id !== '0') {
        adoptee.get({ _id: $routeParams.id }).$promise.then(function(retVal){
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

    $scope.update = function(form, newFlag){
      if(form.$invalid) {
        $scope.submitted = true;
        return;
      }
      $scope.newFlag = newFlag;
      var adoptee = $scope.adoptee;
      if (adoptee.applicationNumber)
      {
            $scope.adopteeUpdate();
      } else {
          adopteeApplicationCounter.getNextSequence().$promise.then(function (retVal) {
              if (retVal.error) {
                  mvNotifier.notify(retVal.error);
              }
              else {
                  adoptee.applicationNumber = retVal.seq;
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
      adoptee.householdMembers.push({});
    };
  
    $scope.deleteHouseholdMember = function(householdMember){
        var adoptee = $scope.adoptee;
        var i = adoptee.householdMembers.indexOf(householdMember);
        if (i != -1)
        {
            adoptee.householdMembers.splice(i,1);
        }
    };

    $scope.adopteeUpdate = function(){
        adoptee.updateAdoptee($scope.adoptee).$promise.then(function (retVal) {
            if (retVal.error) {
                mvNotifier.notify(retVal.error);
            }
            else {
                mvNotifier.notify(retVal.firstName + ' ' + retVal.lastName + ' successfully saved!');
                $scope.adopteeTitle = '';
                if ($scope.newFlag) {
                    $scope.setNewAdoptee();
                    $location.path('/adoptees/0');
                }
                else{
                    $scope.adoptee = retVal;
                    $scope.adoptee.birthDate = $filter('date')($scope.adoptee.birthDate, 'yyyy-MM-dd');
                    $location.path('/adoptees');
                }
            }
        });
    };
    
    $scope.cancel = function() {
      //$scope.adoptee = angular.copy($scope.master);
      $location.path('/adoptees');
    };
    
    $scope.setFlags = common.setFlags;
  });