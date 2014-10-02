angular.module('app').factory('mvCachedAdopters', function(mvAdopter) {
    var adopterList;

    return {
        query: function() {
            if(!adopterList) {
                adopterList = mvAdopter.query();
            }

            return adopterList;
        }
    }
})