angular.module('app').
  controller('AdopterAdopteeCtrl', function($scope, $location) {
    $scope.page = {
      current: 1,
      total: 1,
      previous: 1,
      next: 1,
      size: 10
    };
    
    $scope.sort = {
      value: 'lastName' 
    };

    $scope.applyPage = function(page) {
      if($scope.adoptees) {
        $scope.page.current = page;
        $scope.page.total = Math.ceil($scope.adoptees.length / $scope.page.size);
        $scope.page.previous = page > 1 ? page - 1 : page;
        $scope.page.next = page < $scope.page.total ? page + 1 : page;
      }
    };
    
    $scope.select = function(adoptee) {
      $location.path('/adoptees/' + adoptee._id);
    };

    $scope.$watch('adoptees', function(newValue, oldValue) {
      if(newValue) {
        $scope.applyPage(1); 
      }
    });
  });