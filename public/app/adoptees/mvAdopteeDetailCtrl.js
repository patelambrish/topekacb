angular.module('app').controller('mvAdopteeDetailCtrl', function($scope, mvAdoptee, $q, $routeParams) {
  mvAdoptee.query().$promise.then(function(collection) {
    collection.forEach(function(adoptee) {
      if(adoptee._id === $routeParams.id) {
        $scope.adoptee = adoptee;
        $scope.genders = [
              {name:'Male'},
              {name:'Female'}
          ];
        $scope.selectedGender;
        $scope.genders.forEach(function(gender){
              if (gender.name == adoptee.gender)  {
                  $scope.selectedGender = gender;
              }
        });
        $scope.languages = [
              {name:'Spanish'},
              {name:'Spanish/English spoken by'}
          ];
        $scope.selectedLanguage;
        $scope.languages.forEach(function(language){
            if (language.name == adoptee.language)  {
                $scope.selectedLanguage = language;
            }
         });
      }
    })
  });
  $scope.update = function(){
      var dfd = $q.defer();
      var adoptee = $scope.adoptee;
      mvAdoptee.updateAdoptee(adoptee).then(function(retVal) {
          dfd.resolve();
      }, function(response) {
          dfd.reject(response.data.reason);
      })
      return dfd.promise;
    }
});