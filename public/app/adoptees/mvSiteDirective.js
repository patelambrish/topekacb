angular.module('app').directive('mvSiteDirective',
    function(mvSite) {
        return {
            templateUrl : '/partials/adoptees/adoptee-details',
            link: function(scope, element) {
                scope.isCurrentSiteSet = mvSite.isCurrentSiteSet();
                scope.getCurrentSite = function(){
                    return mvSite.getCurrentSite();
                };

                var dialog = element.find('.modal');
                if ((!scope.isCurrentSiteSet) && scope.adopteeTitle) {
                    dialog.modal('show');
                };

                scope.closeModal = function(site) {
                    mvSite.setSite(site);
                    dialog.modal('hide');
                };
            }
        };
    });