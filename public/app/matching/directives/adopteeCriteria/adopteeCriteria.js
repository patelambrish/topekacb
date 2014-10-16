angular.module('app').directive('adopteeCriteria', [
    function() {
        return {
            templateUrl : '/partials/matching/directives/adopteeCriteria/adopteeCriteria',
            restrict: 'A',
            controller: ['$scope', function($scope) {
                $scope.adopteeEnums;

                $scope.select = function(adoptee){
                    $scope.adopteeEnums = adoptee.enums;
                }
            }]
        };
    }]);