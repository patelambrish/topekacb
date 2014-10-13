angular.module('app').directive('adopteeSearchResults', ['adoptee','$filter',
    function(adoptee, $filter) {
        return {
            templateUrl : '/partials/matching/directives/adopteeSearch/adopteeSearchResults',
            restrict: 'A',
            controller: ['$scope', function($scope) {
                //default page size
                $scope.adopteePage = {
                    current : 1,
                    total : 1,
                    previous : 1,
                    next : 1,
                    size : 3
                };

                $scope.searchAdoptees = function(criteria) {
                    console.log(criteria);
                    if (criteria) {
                        criteria['status'] = "Not Matched";
                        adoptee.query({
                            filter: criteria,
                            sort: "lastName", //
                            start: ($scope.adopteePage.current * $scope.adopteePage.size) - $scope.adopteePage.size,
                            limit: $scope.adopteePage.size
                        }).$promise.then(function (res) {
                                $scope.adopteeSearchResults = res;
                                $scope.applyPage($scope.adopteePage.current, $scope.adopteeSearchResults, $scope.adopteePage);
                            });
                    }
                }
                $scope.getAdopteePage(1);
            }]
        };
    }]);