angular.module('app').factory('mvAdoptee', function($resource, $q) {
  var AdopteeResource = $resource('/api/adoptees/:_id', {_id: "@id"}, {
    updateAdoptee: {method:'PUT', isArray:false}
  });

  return AdopteeResource;
});