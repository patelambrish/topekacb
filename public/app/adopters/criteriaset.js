angular.module('app').
  directive('criteriaset', function(common) {
    return {
      scope: {
        enums: '=',
        criteria: '='
      },
      templateUrl: '/partials/adopters/criteriaset',
      link: function(scope) {
        scope.setFlags = common.setFlags;
      }
    };
  });
