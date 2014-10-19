angular.module('app').
  controller('adopteeDetailCtrl', function($scope, $routeParams, $location, $filter, cbSites, cbCurrentSite, Adoptee, AdopteeApplicationCounter, mvNotifier, common) {
    $scope.sites = cbSites;
    $scope.enums = Adoptee.enums({ _id: $routeParams.id });
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
        Adoptee.get({ _id: $routeParams.id }).$promise.then(function(retVal){
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
      if ($scope.adoptee.applicationNumber)
      {
            $scope.adopteeUpdate();
      } else {
          adopteeApplicationCounter.getNextSequence().$promise.then(function (retVal) {
              if (retVal.error) {
                  mvNotifier.notify(retVal.error);
              }
              else {
                  $scope.Adoptee.applicationNumber = retVal.seq;
                  $scope.adopteeUpdate();

              }
          });
      }
    };

    $scope.addHouseholdMember = function(){
      if (!$scope.adoptee.householdMembers)
      {
        $scope.adoptee.householdMembers = [];
      }
      $scope.adoptee.householdMembers.push({});
    };
  
    $scope.deleteHouseholdMember = function(householdMember){
        var i = $scope.adoptee.householdMembers.indexOf(householdMember);
        if (i != -1)
        {
            $scope.adoptee.householdMembers.splice(i,1);
        }
    };

    $scope.adopteeUpdate = function(){
        Adoptee.updateAdoptee($scope.adoptee).$promise.then(function (retVal) {
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