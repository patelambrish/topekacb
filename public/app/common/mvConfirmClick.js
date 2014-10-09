angular.module('app').
  directive('confirmClick', function($timeout) {
    return {
      restrict: 'A',
      scope: true,
      link: function(scope, element, attrs) {
        var callback = attrs.confirmClick,
            originalText = element.html(),
            originalIconClass = angular.element(element.find('i')).attr('class'),
            confirmText = attrs.confirmText,
            confirmClass = attrs.confirmClass,
            confirmIconClass = attrs.confirmIconClass,
            resetTrigger = attrs.confirmResetTrigger || 'mouseout',
            confirmPopout = attrs.confirmPopout,
            timer;
        
        scope.clicked = false;
        scope.delayed = false;
        
        function reset() {
          $timeout.cancel(timer);

          element.
            removeClass(confirmClass).
            html(originalText).
            find('i').
            removeClass(confirmIconClass);

          scope.clicked = false;
          scope.delayed = false;
        }
        
        if(resetTrigger === 'mouseout') {
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
        }
        
        if(confirmPopout) {
          element.popover({
            content: 'Click again to confirm.',
            placement: 'left',
            title: 'Confirm delete',
            trigger: 'focus'
          });
        }

        element.on('click', function(e) {
          e.stopPropagation();
          
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
                html(confirmText).
                find('i').
                addClass(confirmIconClass);
            });
  
            $timeout(function () {
              scope.delayed = true;

              element.
                removeAttr('disabled').
                removeClass('disabled');
            }, 300);
            
            if(resetTrigger === 'timeout') {
              timer = $timeout(reset, 1500);
            }
          }
        });
      }
    };
  });