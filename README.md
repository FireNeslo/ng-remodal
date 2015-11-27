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
