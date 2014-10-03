angular.module('app').factory("HttpErrorInterceptorModule", ["$q", "$rootScope", "$location",
    function($q, $rootScope, $location) {
        var success = function(response) {
            // pass through
            return response;
        },
            error = function(response) {
                if(response.status === 403) {
                    $location.path('/');
                }

                return $q.reject(response);
            };

        return function(httpPromise) {
            return httpPromise.then(success, error);
        };
    }
]).config(["$httpProvider",
    function($httpProvider) {
        $httpProvider.responseInterceptors.push("HttpErrorInterceptorModule");
    }
]);