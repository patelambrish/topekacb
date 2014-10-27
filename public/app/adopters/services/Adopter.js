angular.module('app').factory('Adopter', function($resource) {
	var AdopterResource = $resource('/api/adopters/:id', null, {
		query: {
			method: 'GET',
			isArray: false
		},
		enums: {
			method: 'GET',
			url: '/api/adopters/:id/enums',
			isArray: false
		},
		removeAdoptee: {
		  method: 'DELETE',
      url: '/api/adopters/:id/adoptees/:adopteeId',
		  isArray: false
		}
	});

	return AdopterResource;
});