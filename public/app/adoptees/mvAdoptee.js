angular.module('app').factory('mvAdoptee', function($resource) {
  var AdopteeResource = $resource('/api/adoptees/:_id', {_id: "@id"}, {
    update: {method:'PUT', isArray:false}
  });

  return AdopteeResource;
});