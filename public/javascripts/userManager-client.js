var app = angular.module('userManagerApp', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        controller: 'userManagerController',
        templateUrl: '/'
    })
    .otherwise({ redirectTo: '/' });
}]);

angular.module('userManagerApp').factory('dataFactory', ['$http', function($http) {
    var dataFactory = {};

    dataFactory.getUsers = function () {
        return $http.get('/profile/messages');
    };

    dataFactory.getUser = function (id) {
        return $http.get('/users/' + id);
    };

    dataFactory.insertUser = function (user) {
        return $http.post('/users', user);
    };

    dataFactory.updateUser = function (user) {
        return $http.post('/profile/messages/' + user._id, user)
    };

    dataFactory.deleteUser = function (id) {
        return $http.delete('/profile/messages/' + id);
    };

    return dataFactory;
}]);

angular.module('userManagerApp')
  .controller('userManagerController', [
    '$scope', 'dataFactory', function ($scope, dataFactory) {

    $scope.users;

    getUsers();

    function getUsers() {
        dataFactory.getUsers()
            .success(function (users) {
                $scope.users = users;
            })
            .error(function (error) {
                alert('Unable to load user data: ' + error.message);
            });
    }

    $scope.insertUser = function (user) {
    dataFactory.insertUser(user)
        .success(function () {
            console.log(user);
            window.location.href = "/";
        }).
        error(function(error) {
            alert('Unable to insert user: ' + error);
        });
    };

    $scope.deleteUser = function (userId) {
        console.log("DELETEUSER");
        dataFactory.deleteUser(userId)
            .success(function () {
                window.location.href = "/profile";
            }).
            error(function(error) {
                alert('Unable to delete user: ' + error);
            });
    };

    $scope.updateUser = function (user) {
        dataFactory.updateUser(user)
            .success(function () {
                window.location.href = "/profile";
            }).
            error(function(error) {
                alert('Unable to update user: ' + error);
            });
    };
}]);
