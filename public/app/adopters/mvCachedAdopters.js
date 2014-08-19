/**
 * Created by Susan on 8/19/2014.
 */
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