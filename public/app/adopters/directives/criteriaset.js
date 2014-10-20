angular.module('app').
  directive('criteriaset', function(common) {
    return {
      scope: {
        adopter: '=',
        fields: '=',
        selected: '='
      },
      replace: true,
      templateUrl: '/partials/adopters/criteriaset',
      link: function(scope, element, attrs) {
        scope.title = attrs.title;
      },
      controller: function($scope, $location) {
        $scope.page = {
          current: 1,
          total: 1,
          previous: 1,
          next: 1,
          size: 3
        };
        
        $scope.sort = {
          value: 'lastName' 
        };
    
        $scope.applyPage = function(page) {
          if($scope.adopter.adoptees) {
            $scope.page.current = page;
            $scope.page.total = Math.ceil($scope.adopter.adoptees.length / $scope.page.size);
            $scope.page.previous = page > 1 ? page - 1 : page;
            $scope.page.next = page < $scope.page.total ? page + 1 : page;
          }
        };
        
        $scope.select = function(adoptee) {
          $location.path('/adoptees/' + adoptee._id);
        };
    
        $scope.setFlags = common.setFlags;

        $scope.$watch('adopter.adoptees', function(newValue, oldValue) {
          if(newValue) {
            $scope.applyPage(1); 
          }
        });
      }
    };
  });
