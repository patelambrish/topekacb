angular.module('app').controller('mvMatchCtrl', ['$scope', '$filter', 'mvNotifier', 'Adopter', 'Adoptee',
function($scope, $filter, mvNotifier, Adopter, Adoptee) {
    $scope.template = {
        adopterMatchUrl: '/partials/matching/adopter-match',
        adopteeListUrl: '/partials/adopters/adoptee-list'
    };
    $scope.adopteeList = { heading: 'Matched Adoptees' };
    $scope.adopterSearchResults = [];
    $scope.adopteeSearchResults = [];
    $scope.currentAdopter;
    $scope.currentAdoptee;
    $scope.ageRanges = ["0-7", "8-12", "13-18"];
    $scope.adopteeEnums;
    $scope.adopteeAges = [];

    $scope.applyPage = function (page, data, pageInfo) {
        pageInfo.current = page;
        if (data && data.totalCount) {
            pageInfo.total = Math.ceil(data.totalCount / pageInfo.size);
        }
        pageInfo.previous = page > 1 ? page - 1 : page;
        pageInfo.next = page < pageInfo.total ? page + 1 : page;

    };

    $scope.getAdopterPage = function (page) {
        $scope.adopterPage.current = page;
        $scope.searchAdopters();
    };

    $scope.getAdopteePage = function (page) {
        $scope.adopteePage.current = page;
        if ($scope.currentAdopter) {
            $scope.searchAdoptees($scope.currentAdopter.criteria);
        }
    };

    $scope.selectAdoptee = function (selectedAdoptee) {
        $scope.currentAdoptee = selectedAdoptee;
        $scope.adopteeAges = [];
        selectedAdoptee.householdMembers.forEach(function (member) {
            if (member.age < 8 && $scope.adopteeAges.indexOf($scope.ageRanges[0]) == -1) {
                $scope.adopteeAges.push($scope.ageRanges[0]);
            }
            if (member.age > 7 && member.age < 13 && $scope.adopteeAges.indexOf($scope.ageRanges[1]) == -1) {
                $scope.adopteeAges.push($scope.ageRanges[1]);
            }
            if (member.age > 12 && member.age < 19 && $scope.adopteeAges.indexOf($scope.ageRanges[2]) == -1) {
                $scope.adopteeAges.push($scope.ageRanges[2]);
            }
        });
    };

    $scope.bulkMatch = function () {
        var criteria = $scope.currentAdopter.criteria;
        criteria['status'] = "Not Matched";
        Adoptee.query({
            filter: criteria,
            start: 0,
            limit: $scope.currentAdopter.criteria.count}).$promise.then(function (res) {
                var searchResults = res.data;
                if ($scope.currentAdopter.status == "Matched") {
                    mvNotifier.notify($scope.currentAdopter.name + " is fully matched.");
                }
                else {
                    searchResults.forEach(function (a) {
                        if (!$scope.currentAdopter.adoptees) {
                            $scope.currentAdopter.adoptees = [];
                        }
                        $scope.currentAdopter.adoptees.push(a);
                        a._adopterId = $scope.currentAdopter._id;
                        a.status = "Matched";
                        Adoptee.updateAdoptee(a);

                    });
                    $scope.currentAdopter.status = "Matched";
                    var updatedAdopter = $scope.currentAdopter;
                    var adopteeIds = [];
                    $scope.currentAdopter.adoptees.forEach(function(a){
                        adopteeIds.push(a._id);
                    });
                    updatedAdopter.adoptees = adopteeIds;
                    Adopter.save(updatedAdopter).$promise.then(function (retVal) {
                        if (retVal.error) {
                            mvNotifier.notify(retVal.error);
                        }
                        else {
                            mvNotifier.notify($scope.currentAdopter.name + ' matched with ' + $scope.currentAdopter.criteria.count + ' adoptees!');

                        }
                    });
                    $scope.searchAdoptees($scope.currentAdopter.criteria);
                }
        });
    };

    $scope.matchAdoptee = function (){
        if ($scope.currentAdopter.status == "Matched") {
            mvNotifier.notify($scope.currentAdopter.name + " is fully matched.");
        }
        else {
            $scope.currentAdoptee._adopterId = $scope.currentAdopter._id;
            $scope.currentAdoptee.status = "Matched";
            if (!$scope.currentAdopter.adoptees) {
                $scope.currentAdopter.adoptees = [];
            }
            $scope.currentAdopter.adoptees.push($scope.currentAdoptee);
            if ($scope.currentAdopter.adoptees.length == $scope.currentAdopter.criteria.count) {
                $scope.currentAdopter.status = "Matched";
            }
            var updatedAdopter = $scope.currentAdopter;
            var adopteeIds = [];
            $scope.currentAdopter.adoptees.forEach(function(a){
                adopteeIds.push(a._id);
            });
            updatedAdopter.adoptees = adopteeIds;
            Adoptee.updateAdoptee($scope.currentAdoptee).$promise.then(function (retAdoptee) {
                if (retAdoptee.error) {
                    mvNotifier.notify(retAdoptee.error);
                }
                else {
                    $scope.currentAdoptee = retAdoptee;
                    Adopter.save(updatedAdopter).$promise.then(function (retAdopter) {
                        if (retAdopter.error) {
                            mvNotifier.notify(retAdopter.error);
                        }
                        else {
                            //$scope.currentAdopter = retAdopter;
                            mvNotifier.notify($scope.currentAdoptee.firstName + ' ' + $scope.currentAdoptee.lastName + ' matched with ' + $scope.currentAdopter.name + '!');

                        }
                    });
                    $scope.searchAdoptees($scope.currentAdopter.criteria);
                }
            });
        }
    };


    $scope.selectAdopter = function(adopter){
          $scope.currentAdopter = Adopter.get({ _id: adopter._id });
          $scope.currentAdopter.$promise.
            then(function(data) {
              $scope.adoptees = data.adoptees;
              $scope.searchAdoptees(data.criteria);
            });
    };
    
}]);