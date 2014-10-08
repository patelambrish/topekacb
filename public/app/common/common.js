angular.module('app').
  factory('common', function() {
    return {
      setFlags: function(flags, value) {
        var array = flags,
            index;

        if(!angular.isArray(array)) {
          array = (flags = []);
        }

        index = array.indexOf(value);

        if(index === -1) {
          array.push(value);
        } else {
          array.splice(index, 1);
        }
      }
    };
  });