angular.module('app').controller('mvMainCtrl', ['$scope', 'mvNotifier', 'mvSharedContext', function($scope, mvNotifier, mvSharedContext) {
  if(mvSharedContext.message()) {
  	mvNotifier.notify(mvSharedContext.message());
  	mvSharedContext.clearContext();
  }
}]);