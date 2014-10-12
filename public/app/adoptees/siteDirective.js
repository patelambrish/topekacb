angular.module('app')
  .directive('siteDirective', function($document, cbSites, cbCurrentSite) {
    return {
      replace: true,
      scope: {
        onsave: '&'
      },
      templateUrl : '/partials/adoptees/adoptee-sites',
      link: function(scope, element) {
        scope.sites = cbSites;
        scope.selected = {};

        element.modal();

        scope.save = function(site) {
          cbCurrentSite.set(site);
          (scope.onsave || angular.noop)(scope.selected);
        };

        element.on('$destroy', function() {
          // remove orphaned modal backdrops
          angular.element($document[0].body).
            find('.modal-backdrop').
            remove();
        });
      }
    };
  });