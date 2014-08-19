/**
 * Created by Susan on 8/19/2014.
 */
angular.module('app').controller('mvAdopterDetailCtrl', function($scope, mvCachedAdopters, $routeParams) {
    mvCachedAdopters.query().$promise.then(function(collection) {
        collection.forEach(function(adopter) {
            if(adopter._id === $routeParams.id) {
                $scope.adopter = adopter;
            }
        })
    })
});