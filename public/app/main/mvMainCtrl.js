angular.module('app').controller('mvMainCtrl', ['$scope', 'mvCachedAdoptees', 'mvNotifier', 'mvSharedContext', function($scope, mvCachedAdoptees, mvNotifier, mvSharedContext) {
  $scope.adoptees = mvCachedAdoptees.query();
  if(mvSharedContext.message()) {
  	mvNotifier.notify(mvSharedContext.message());
  	mvSharedContext.clearContext();
  }
}]);