angular.module('app').
  factory('common', function() {
    return {
      setFlags: function(flags, value, exclusive) {
        var array = flags,
            index;

        if(!angular.isArray(array)) {
          array = (flags = []);
        }

        if(exclusive) {
          array.length = 0;
        }
        
        index = array.indexOf(value);

        if(index === -1) {
          array.push(value);
        } else {
          array.splice(index, 1);
        }
      }
    };
  }).
  filter('startFrom', function() {
    return function(array, start) {
      start = parseInt(start, 10);

      return (angular.isArray(array) || angular.isString(array)) && start ? array.slice(start) : array;
    };
  }).
  filter('fullName', function() {
    return function(data, format) {
      if(!data) {
        return;
      }

      var fName = data.firstName || '',
          lName = data.lastName || '';

      format = format || 'ltr';

      if(format === 'ltr') {
        return fName && lName ? lName + ', ' + fName : lName + fName;
      } else {
        return fName && lName ? fName + ' ' + lName : lName + fName;
      }
    };
  }).
  directive('toggle', function() {
    return {
      link: function(scope, element, attrs) {
        var target;

        function toggleIcon() {
          element.find('i').toggleClass('fa-rotate-180');
        }

        if(attrs.toggle === 'collapse') {
          target = $(attrs.target).eq(0);
          target.on('show.bs.collapse', toggleIcon);
          target.on('hide.bs.collapse', toggleIcon);
        }
      }
    };
  });