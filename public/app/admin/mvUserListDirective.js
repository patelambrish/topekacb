angular.module('app').directive('mvUserList',
function() {
	return {
		templateUrl : '/partials/admin/user-list',
		link: function(scope, element) {
			var mdialog = element.find('.modal');

			scope.closeModal = function() {
				mdialog.modal('hide');
			};

			mdialog.on('show.bs.modal', function() {
				scope.userForm.$setPristine();
			});

		}
	};
});