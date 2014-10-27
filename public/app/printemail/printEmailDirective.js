angular.module('app').directive('printEmail', ['Adopter', '$filter',
function(Adopter, $filter) {
	return {
		templateUrl : '/partials/printemail/printEmail',
		restrict : 'A'
	};
}]);
