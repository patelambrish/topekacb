angular.module('app').
  directive('confirmClick', function($timeout) {
    return {
      restrict: 'A',
      scope: true,
      link: function(scope, element, attrs) {
        var callback = attrs.confirmClick,
            originalText = element.html(),
            confirmText = attrs.confirmText,
            confirmClass = attrs.confirmClass,
            timer;
        
        scope.clicked = false;
        scope.delayed = false;

        function reset() {
          element.
            removeClass(confirmClass).
            html(originalText);

          scope.clicked = false;
          scope.delayed = false;
        }
        
        element.on('mouseout', function() {
          if(scope.delayed && !timer) {
            timer = $timeout(reset, 1500);
          }
        });
        
        element.on('mouseover', function() {
          if(timer) {
            $timeout.cancel(timer);
            timer = null;
          }
        });

        element.on('click', function(e) {
          if(scope.clicked && scope.delayed) {
            scope.$parent.$apply(callback);
            reset();
          } else if(scope.clicked) {
              e.stopImmediatePropagation();
              e.preventDefault();

              return false;
          } else {
            scope.$apply(function() {
              scope.clicked = true;

              element.
                attr('disabled', 'disabled').
                addClass('disabled').
                addClass(confirmClass).
                html(confirmText);
            });
  
            $timeout(function () {
              scope.delayed = true;

              element.
                removeAttr('disabled').
                removeClass('disabled');
            }, 300);
          }
        });
      }
    };
  });