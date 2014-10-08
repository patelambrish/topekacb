angular.module('app').factory('mvAdopter', function($resource) {
	var AdopterResource = $resource('/api/adopters/:_id', {
		_id : '@id'
	}, {
		query : {
			method : 'GET',
			isArray : false
		},
		enums : {
			method : 'GET',
			url : '/api/adopters/:_id/enums',
			isArray : false
		}
	});

	return AdopterResource;
});