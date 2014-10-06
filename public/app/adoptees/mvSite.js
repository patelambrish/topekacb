angular.module('app').factory('mvSite', function($window) {
    var currentSite;

    return {
        getCurrentSite: function(){
            return currentSite;
        },
        setSite: function(site) {
            currentSite = site;
        },
        isCurrentSiteSet: function()
        {
            return !!currentSite;
        }
    }
})