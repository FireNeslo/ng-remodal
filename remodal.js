(function(global, $) {
  "use strict"
  angular.module('remodal', [])
    .factory('remodal', [
      '$templateRequest', '$rootScope', '$controller', '$compile', '$q',
      function factory($templateRequest, $rootScope, $controller, $compile, $q){
        function Remodal(options) {
          var url = options.templateUrl, template = options.template
          this.scope = (options.scope || $rootScope).$new()
          this.element = this.template(template || $templateRequest(url))
          this.options = options
        }
        angular.extend(Remodal.prototype, {
          template: function template(markup) {
            var scope = this.scope
            return this.modal || (this.modal =
              $q.when(markup).then(function compile(template) {
                return $compile(template)(scope)
              }))
          },
          accept: function accept(reason) {
            return this.close(reason||true)
          },
          dismiss: function dismiss(reason) {
            return this.close(new Error(reason))
          },
          close: function close(reason) {
            this.element.then(function(element) {
              return element.remodal().close(reason)
            })
          },
          open: function open(locals) {
            var options = this.options, scope = this.scope
            if(options.controller) {
              this.controller = $controller(options.controller,
                angular.extend(locals || {}, {$scope:this.scope, $modal: this}))
            } else {
              angular.extend(this.scope, locals, {$modal: this})
            }
            if(options.controllerAs) {
              scope[options.controllerAs] = controller
            }
            return this.modal.then(function created(element) {
              var modal = element.remodal(options), success = true

              element.on('cancellation', function cancel() {
                success = false
                element.off('cancellation', cancel)
              })
              return $q(function waitForClose(resolve, reject) {
                element.on('closed', function closed(e) {
                  success = success && !(e.reason instanceof Error) && e.reason
                  if(!e.reason) {
                    e.reason = 'dismission'
                    success = false
                  }
                  if(success) resolve(e.reason || false)
                  else reject(e.reason instanceof Error ?
                    e.reason : new Error(e.reason))
                  element.off('closed', closed)
                })
                modal.open()
              })
            })
          }
        })
        return function remodal(options) {
          if(angular.isString(options)) {
            if(options.indexOf('<') > -1) {
              options = {template: options}
            } else {
              options = {templateUrl: options}
            }
          }
          return new Remodal(options)
        }
      }
    ])
}(window, window.jQuery))
