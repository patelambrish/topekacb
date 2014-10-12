angular.module('app').directive('adopterMatchResults', ['mvAdopter','$filter',
    function(mvAdopter, $filter) {
        return {
            templateUrl : '/partials/matching/directives/adopterSearch/adopterMatchResults',
            restrict: 'A',
            controller: ['$scope', function($scope) {
                $scope.adopteeSearch = function(adopter){
                    console.log('got it');
                }
            }]
        };
    }]);