angular.module('app').directive('adopteeSearch', ['Adoptee','$filter', 'cachedAdoptees',
    function(Adoptee, $filter, cachedAdoptees) {
        return {
            templateUrl : '/partials/matching/directives/adopteeSearch/adopteeSearch',
            restrict: 'A',
            replace: true,
            controller: ['$scope', function($scope) {
                //default page size
                $scope.adopteePage = {
                    current : 1,
                    total : 1,
                    previous : 1,
                    next : 1,
                    size : 3
                };

                $scope.adopteeFilter = {};

                cachedAdoptees.enums({
                    _id : 0
                }).$promise.then(function(data) {
                        $scope.adopteeEnums = data;
                    });

                $scope.adopteeSort = {
                    value : 'lastName',
                    text : 'Name: A to Z',
                    options : [{
                        value : 'lastName',
                        text : 'Name: A to Z'
                    }, {
                        value : '-lastName',
                        text : 'Name: Z to A'
                    }]
                };

                $scope.applyAdopteeSort = function(sortOption) {
                    angular.extend($scope.adopteeSort, sortOption);
                    $scope.getAdopteePage(1);
                };

                $scope.applyAdopteeFilter = function(filter) {
                    angular.extend($scope.adopteeFilter, filter);
                    //$scope.getAdopteePage(1);
                    $scope.adopteePage.current = 1;
                    $scope.nameSearch();
                };

                $scope.searchAdoptees = function(criteria) {
                    if (!criteria){
                      criteria = {};
                    }
                    criteria.status = "Not Matched";
                    Adoptee.query({
                        filter: criteria,
                        sort: $scope.adopteeSort.value,
                        start: ($scope.adopteePage.current * $scope.adopteePage.size) - $scope.adopteePage.size,
                        limit: $scope.adopteePage.size
                    }).$promise.then(function (res) {
                            $scope.adopteeSearchResults = res;
                            $scope.applyPage($scope.adopteePage.current, $scope.adopteeSearchResults, $scope.adopteePage);
                            if (res.data.length > 0) {
                                $scope.selectAdoptee(res.data[0]);
                                $scope.adopteeEnums = Adoptee.enums({ _id: res.data[0]._id });
                            }
                        });
                };

                $scope.nameSearch = function() {
                    Adoptee.query({
                        filter : $scope.adopteeFilter,
                        sort : $scope.adopteeSort.value,
                        start : ($scope.adopteePage.current * $scope.adopteePage.size) - $scope.adopteePage.size,
                        limit : $scope.adopteePage.size
                    }).$promise.then(function(res) {
                            $scope.adopteeSearchResults = res;
                             $scope.applyPage($scope.adopteePage.current, $scope.adopteeSearchResults, $scope.adopteePage);
                        });

                };
                
                $scope.nextAdoptee = function(){
                  // need to find current adoptee in search array by Id instead of by object ref,
                  // because search adoptee is not fully hydrated, while current adoptee is. eg,
                  // household members not included w/ search adoptee for performance reasons.
                  var arr = $scope.adopteeSearchResults.data.map(function(a) { return a._id; });
                  var currentAdopteeIndex = arr.indexOf($scope.currentAdoptee._id);
                  if (currentAdopteeIndex == $scope.adopteePage.size - 1){
                    $scope.adopteePage.current++;
                    $scope.searchAdoptees($scope.currentAdopter.criteria);
                  }
                  else{
                    $scope.selectAdoptee($scope.adopteeSearchResults.data[currentAdopteeIndex + 1]);
                  }
                  
                };
                
                $scope.getAdopteePage(1);
            }]
        };
    }]);
angular.module('app').directive('adopteeSearchResults', ['Adoptee','$filter', 'cachedAdoptees',
    function(Adoptee, $filter, cachedAdoptees) {
        return {
            templateUrl : '/partials/matching/directives/adopteeSearch/adopteeSearchResults',
            restrict: 'A',
            replace: true
        };
    }]);