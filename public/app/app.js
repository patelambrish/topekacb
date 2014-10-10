angular.module('app', ['ngResource', 'ngRoute', 'newrelic-timing','googlechart','textAngular']);

angular.module('app').config(function($routeProvider, $locationProvider) {
	var routeRoleChecks = {
		admin : {
			auth : function(mvAuth) {
				return mvAuth.authorizeCurrentUserForRoute('admin')
			}
		},
		user : {
			auth : function(mvAuth) {
				return mvAuth.authorizeAuthenticatedUserForRoute()
			}
		}
	}

	$locationProvider.html5Mode(true);
	$routeProvider.when('/', {
		templateUrl : '/partials/main/main',
		controller : 'mvMainCtrl'
	}).when('/admin/users', {
		templateUrl : '/partials/admin/manage-users',
		controller : 'mvUserListCtrl',
		resolve : routeRoleChecks.admin
	})
	//.when('/signup', { templateUrl: '/partials/account/signup',
	//  controller: 'mvSignupCtrl'
	//})
	//.when('/profile', { templateUrl: '/partials/account/profile',
	//  controller: 'mvProfileCtrl', resolve: routeRoleChecks.user
	//})
	.when('/adoptees', {
		templateUrl : '/partials/adoptees/adoptee-list',
		controller : 'mvAdopteeListCtrl',
		resolve : routeRoleChecks.user
	}).when('/adoptees/:id', {
		templateUrl : '/partials/adoptees/adoptee-details',
		controller : 'mvAdopteeDetailCtrl',
		resolve : routeRoleChecks.user
	}).when('/adopters', {
		templateUrl : '/partials/adopters/adopter-list',
		controller : 'mvAdopterListCtrl',
		resolve : routeRoleChecks.user
	}).when('/adopters/:id', {
		templateUrl : '/partials/adopters/adopter-details',
		controller : 'mvAdopterDetailCtrl',
		resolve : routeRoleChecks.user
	}).when('/facebook/:message', {
		resolve : {
			data : ['$route', '$location', 'mvSharedContext',
			function($route, $location, mvSharedContext) {
				mvSharedContext.clearContext();
				mvSharedContext.message($route.current.params.message);
				$location.path('/');
			}]
		}
	}).when('/match', {
		templateUrl: 'partials/matching/match',
		controller: 'mvMatchCtrl',
		resolve : routeRoleChecks.user
	}).	otherwise({
		redirectTo : '/'
	});
});

angular.module('app').run(function($rootScope, $location) {
	$rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
		if (rejection === 'not authorized') {
			$location.path('/');
		}
	})
})
