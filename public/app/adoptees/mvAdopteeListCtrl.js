angular.module('app').
  filter('startFrom', function() {
    return function(array, start) {
      start = parseInt(start, 10);
      
      return (angular.isArray(array) || angular.isString(array)) && start ? array.slice(start) : array;
    };
  }).
  filter('fullName', function() {
    return function(data, format) {
      if(!data) {
        return;
      }
      
      var fName = data.firstName || '',
          lName = data.lastName || '';
          
      format = format || 'ltr';

      if(format === 'ltr') {
        return fName && lName ? lName + ', ' + fName : lName + fName;
      } else {
        return fName && lName ? fName + ' ' + lName : lName + fName;
      }
    };
  }).
  controller('mvAdopteeListCtrl', function($scope, $filter, $location, mvAdoptee) {
    var adoptees = mvAdoptee.query();

    $scope.sort = {
      value: '-createDate',
      text: 'Create Date: Recent to Old',
      options: [
        {value: ['lastName', 'firstName'], text: 'Name'},
        {value: 'createDate', text: 'Create Date: Old to Recent'},
        {value: '-createDate', text: 'Create Date: Recent to Old'}
      ]
    };
    
    $scope.page = {
      current: 1,
      total: 1,
      previous: 1,
      next: 1,
      size: 10
    };
    
    $scope.busy = function() {
      return !adoptees.$resolved;
    };

    $scope.applySort = function(sortOption) {
      angular.extend($scope.sort, sortOption);
    };
    
    $scope.applyFilter = function(query) {
      adoptees.$promise.then(function() {
        $scope.adoptees = $filter('filter')(adoptees, query);
        $scope.applyPage(1);
      });
    };
    
    $scope.applyPage = function(page) {
      $scope.page.current = page;
      $scope.page.total = Math.ceil($scope.adoptees.length / $scope.page.size);
      $scope.page.previous = page > 1 ? page - 1 : page;
      $scope.page.next = page < $scope.page.total ? page + 1 : page;
    };
    
    $scope.select = function(adoptee) {
      $location.path('/adoptees/' + adoptee._id);
    };

    $scope.applyFilter();
  });