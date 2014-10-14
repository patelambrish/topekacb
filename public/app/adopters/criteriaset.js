angular.module('app').
  directive('criteriaset', function(common) {
    return {
      scope: {
        enums: '=',
        criteria: '='
      },
      replace: true,
      templateUrl: '/partials/adopters/criteriaset',
      link: function(scope, element, attrs) {
        scope.setFlags = common.setFlags;
      }
    };
  });
