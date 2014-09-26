angular.module('app').controller('mvUserListCtrl',['$scope', 'mvUser', '$filter', function($scope, mvUser, $filter) {
  $scope.users = mvUser.query({
  });

  var roles = [
    { name: 'admin' },
    { name: 'user' },
    { name: 'adoptee' },
    { name: 'adopter' }
  ],
  originalUser ={};

  function mapRoles() {
    $scope.roles=[];
    angular.copy(roles, $scope.roles);
    angular.forEach($scope.selectedUser.roles, function(role) {
      angular.forEach($scope.roles, function(r){
        if(role === r.name) {
          r.selected = true;
        }
      });
    });
  }

  function reverseMapRoles() {
    var selectedRoles = $filter('filter')($scope.roles, {selected: true}, true),
      userRoles = [];
    angular.forEach(selectedRoles, function(role){
      userRoles.push(role.name);
    });

  }

  $scope.selectUser = function(user) {
    if(user._id) {
      angular.copy(user, originalUser);
    }
    $scope.selectedUser = user;
    mapRoles();
  };

  $scope.newUser = function() {
    var newUser = { roles: {}, active: true };
    $scope.selectUser(newUser);
  };

  $scope.cancel = function(){
    console.log(originalUser);

    if(originalUser._id) {
      angular.copy(originalUser,$scope.selectedUser);
    }
  };

}]);