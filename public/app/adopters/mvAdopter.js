angular.module('app').factory('mvAdopter', function($resource) {
    var AdopterResource = $resource('/api/adopters/:_id', {_id: "@id"}, {
        update: {method:'PUT', isArray:false}
    });

    return AdopterResource;
});