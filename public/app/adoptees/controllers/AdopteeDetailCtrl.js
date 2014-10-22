angular.module('app').
  controller('adopteeDetailCtrl', function($scope, $routeParams, $location, $filter, cbSites, cbCurrentSite, Adoptee, AdopteeApplicationCounter, mvNotifier, common) {
    $scope.sites = cbSites;
    $scope.enums = Adoptee.enums({ _id: $routeParams.id });
    $scope.adopteeTitle = '';
    $scope.setNewAdoptee = function(currentNumber){
        $scope.adoptee = new Adoptee({
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

    $scope.update = function(form, nextFlag){
      if(form.$invalid) {
        $scope.submitted = true;
        mvNotifier.notify('Invalid fields present');
        return;
      }
      //get next adoptee
      $scope.nextFlag = nextFlag;
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
                if ($scope.nextFlag) {
                    Adoptee.getNextAdoptee({nextNumber: retVal.applicationNumber + 1}).$promise.then(function(nextVal){
                        if (!nextVal._id || nextVal.error){
                           mvNotifier.notify(retVal.firstName + ' ' + retVal.lastName + " is the highest numbered Adoptee")
                        }
                        else {
                            $scope.adoptee = nextVal;
                            $scope.adoptee.birthDate = $filter('date')($scope.adoptee.birthDate, 'yyyy-MM-dd');
                            $location.path('/adoptees/' + nextVal._id);
                        }
                    });
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