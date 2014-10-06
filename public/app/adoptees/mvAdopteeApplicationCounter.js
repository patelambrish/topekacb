angular.module('app').factory('mvAdopteeApplicationCounter', function($resource, $q) {
  var AdopteeApplicationCounterResource = $resource('/api/adopteeapplicationcounter', {}, {
    getNextSequence: {method:'Get', isArray:false}
  });
  return AdopteeApplicationCounterResource;
});