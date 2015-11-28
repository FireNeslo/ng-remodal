ng-remodal
===

angular service wrapper for [Remodal](https://github.com/VodkaBears/Remodal)

## Install
```bash
$ bower install FireNeslo/ng-remodal --save
```

## Usage

### simple

```js
angular.module('app', ['remodal'])
  .controller('MainController', function(remodal) {
    remodal('<h1>hello {{name}}<h1>')
      .open({name: 'world'})
      .catch(function(error) {
        console.log(error.toString())
      })
  })
```

### Advanced
```html
<!-- templates/login.html -->
<form ng-submit="login(user)">
  <input placeholder="email" ng-model="user.email" />
  <input type="password" placeholder="password" ng-model="user.email" />
  <input type="submit" value="Login" />
</form>

```

```js

angular.module('app', ['remodal'])
  .factory('modalLogin', function(remodal) {
    return remodal({
      controller: 'LoginController',
      templateUrl: 'templates/login.html'
    })
  })
  .controller('LoginController', function($scope, $modal, $http) {
    if($scope.auth) $scope.auth.then($modal.accept.bind($modal))

    $scope.login = function(user) {
      $scope.auth = $http.post('user/login', user)
        .then(function(response) {
          $scope.user = {}
          $modal.accept(response.data)
        })
        .catch(function(response) {
          $modal.reject(response.data)
        })
    }
  })
  .directive('body', function(modalLogin) {
    return function($scope) {
      function success(user) {
        console.log('logged in:', user)
      }
      function fail() {
        return modalLogin.open().then(success, fail)
      }
      modalLogin.open().then(success, fail)
    }
  })

```

##API

<!-- Start /home/fireneslo/Dropbox/nslo/middleware/index.js -->

## remodal(options|template|templateUrl)  -> modal
If given a string the string will be used as a template if it contains angle
brackets and as a templateUrl otherwise

* **object** *options* - object modal options
* **string** *options.template* - the template for the modal
* **string** *options.templateUrl* - the url to get template from.
* **string|function** *options.controller* - give the modal a controller
* **string** *options.controllerAs* - give the controller a scope alias
* **string** *options.scope* - parent scope for the modal
* **variable** *options.** - any remodal options

## modal.open(locals) -> Promise&lt;reason&gt;
show the modal and give it some data as context.
If the modal was created with a controller all keys on locals can be injected
If no controller then the scope will be extended with the properties.

* **any** *locals* - data for modal

## modal.close(reason) -> Promise&lt;reason&gt;
closes the modal and resolves promise with given reason.

* **any|error** *reason* - resolves with the given reason or rejects with error

## modal.accept(reason) -> Promise&lt;reason&gt;
closes the modal and resolves promise with given reason.

* **value** *reason* - some resolve data

## modal.reject(reason) -> Promise&lt;reason&gt;
closes the modal and rejects promise with given reason.

* **string|error** *reason* - rejection reason will be used as error message
