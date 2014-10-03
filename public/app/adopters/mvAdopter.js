angular.module('app').factory('mvAdopter', function($resource) {
    var AdopterResource = $resource('/api/adopters/:_id', {_id: "@id"}, {
        enums: {method: 'GET', url: '/api/adopters/:_id/enums'}
    });

    return AdopterResource;
});