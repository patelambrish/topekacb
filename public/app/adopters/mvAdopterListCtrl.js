/**
 * Created by Susan on 8/19/2014.
 */
angular.module('app').
    filter("startFrom", function() {
        return function(array, start) {
            start = parseInt(start, 10);
            
            return (angular.isArray(array) || angular.isString(array)) && start ? array.slice(start) : array;
        };
    }).
    controller('mvAdopterListCtrl', function($scope, $filter, mvAdopter) {
        var adopters = mvAdopter.query();

        $scope.sort = {
            value: '-enrolled',
            text: 'Enroll Date: Recent to Old',
            options: [
                {value: 'name', text: 'Name'},
                {value: 'enrolled', text: 'Enroll Date: Old to Recent'},
                {value: '-enrolled', text: 'Enroll Date: Recent to Old'}
            ]
        };
        
        $scope.page = {
            current: 1,
            total: 1,
            previous: 1,
            next: 1,
            size: 10
        };
        
        $scope.applySort = function(sortOption) {
            angular.extend($scope.sort, sortOption);
        };
        
        $scope.applyFilter = function(query) {
            adopters.$promise.then(function() {
                $scope.adopters = $filter('filter')(adopters, { name: query });
                $scope.applyPage(1);
            });
        };
        
        $scope.applyPage = function(page) {
            $scope.page.current = page;
            $scope.page.total = Math.ceil($scope.adopters.length / $scope.page.size);
            $scope.page.previous = page > 1 ? page - 1 : page;
            $scope.page.next = page < $scope.page.total ? page + 1 : page;
        };
        
        $scope.applyFilter();
    });