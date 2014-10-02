angular.module('app').controller('mvUserListCtrl', ['$scope', 'mvUser', '$filter','mvAuth','mvNotifier',
function($scope, mvUser, $filter, mvAuth, mvNotifier) {

	function getUsers() {
		$scope.users = mvUser.query({
		});
	}

	getUsers();

	var roles = [{
		name : 'Admin - User Administration', value: 'admin'
	}, {
		name : 'User - Adoptee, Adopter data entry and Matching', value: 'user'
	}, {
		name : 'Manager - Allow Delete', value: 'manager'
	}, {
		name : 'Observer - Readonly', value: 'observer'
	}], originalUser = {};

	$scope.roles = [];

	angular.copy(roles, $scope.roles);

	function mapRoles() {
		//$scope.roles = [];
		angular.copy(roles, $scope.roles);
		angular.forEach($scope.selectedUser.roles, function(role) {
			angular.forEach($scope.roles, function(r) {
				if (role === r.value) {
					r.selected = true;
				}
			});
		});
	}

	$scope.selectUser = function(user) {
		if (user._id) {
			angular.copy(user, originalUser);
		}
		$scope.selectedUser = user;
		mapRoles();
	};

	$scope.newUser = function() {
		var newUser = new mvUser();
		newUser.roles = [];
		newUser.active = true;
		$scope.selectUser(newUser);
	};

	$scope.cancel = function() {
		if (originalUser._id) {
			angular.copy(originalUser, $scope.selectedUser);
		}
	};

	function setUserRoles() {
		var assignRoles = $filter('filter')($scope.roles, {selected:true}, true);
		$scope.selectedUser.roles =[];
		angular.forEach(assignRoles, function(r){
			$scope.selectedUser.roles.push(r.value);
		});
	}

	$scope.saveUser = function() {
		setUserRoles();
		if($scope.selectedUser._id) {
			$scope.selectedUser.$update(function(savedUser, headers) {
				$scope.selectedUser = savedUser;
				mvNotifier.notify('User information updated successfully');
				getUsers();
				$scope.closeModal();
			});
		}
		else {
			$scope.selectedUser.$save($scope.selectedUser,function(savedUser, headers) {
				$scope.selectedUser = savedUser;
				mvNotifier.notify('User created successfully');
				getUsers();
				$scope.closeModal();
			});
		}
	};

}]);