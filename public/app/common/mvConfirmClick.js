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
            popoutId = 'p' + new Date().getTime(),
            timer;
        
        var popoutHtml = 
          '<div class="text-center">' +
            '<div class="btn-group btn-group-sm">' +
              '<button class="btn btn-danger"><i class="glyphicon glyphicon-ok"></i> Yes</button>' +
              '<button class="btn btn-default">Cancel</button>' +
            '</div>'
          '</div>';

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

        function popoutHandlers(onoff) {
            var popoutEl = element.next('.popover');

            popoutEl[onoff]('click', function(e) {
              e.stopPropagation();
            });

            popoutEl.find('.btn-danger')[onoff]('click', function() {
              scope.$parent.$apply(callback);
            });

            popoutEl.find('.btn-default')[onoff]('click', function() {
              element.popover('hide');
            });
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
            content: popoutHtml,
            html: true,
            placement: confirmPopout,
            trigger: 'focus'
          });

          element.on('shown.bs.popover', function() {
            popoutHandlers('on');
          });

          element.on('hide.bs.popover', function() {
            popoutHandlers('off');
          });
        }

        element.on('click', function(e) {
          e.stopPropagation();

          if(confirmPopout) {
            return;
          }
          
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