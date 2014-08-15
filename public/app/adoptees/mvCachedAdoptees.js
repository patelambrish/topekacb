angular.module('app').factory('mvCachedAdoptees', function(mvAdoptee) {
  var adopteeList;

  return {
    query: function() {
      if(!adopteeList) {
        adopteeList = mvAdoptee.query();
      }

      return adopteeList;
    }
  }
})