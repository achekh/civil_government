'use strict';

angular.module('mean.auth')
    .controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$state',
        function($scope, $rootScope, $http, $state) {
            // This object will be filled by the form
            $scope.user = {};

            $.getScript('//ulogin.ru/js/ulogin.js');

            // Register the login() function
            $scope.login = function() {
                $http.post('/login', {
                    email: $scope.user.email,
                    password: $scope.user.password
                })
                    .success(function(response) {
                        // authentication OK
                        $scope.loginError = 0;
                        $rootScope.user = response.user;
                        $rootScope.$emit('loggedin');
                        if (response.redirect) {
                            if (window.location.href === response.redirect) {
                                //This is so an admin user will get full admin page
                                window.location.reload();
                            } else {
                                window.location = response.redirect;
                            }
                        } else {
                            $state.go('activists-view-self');
                        }
                    })
                    .error(function() {
                        $scope.loginerror = 'Авторизация отклонена.';
                    });
            };
        }
    ])
    .controller('RegisterCtrl', ['$scope', '$rootScope', '$http', '$state',
        function($scope, $rootScope, $http, $state) {
            $scope.user = {};

            $scope.register = function() {
                $scope.usernameError = null;
                $scope.registerError = null;
                $http.post('/register', {
                    name: $scope.user.name,
                    email: $scope.user.email,
                    password: $scope.user.password,
                    confirmPassword: $scope.user.confirmPassword
                })
                    .success(function() {
                        // registration OK
                        $scope.registerError = 0;
                        $http.get('/loggedin').success(function(user) {
                            $rootScope.user = user;
                            $rootScope.$emit('loggedin');
                            $state.go('activists-view-self');
                        });
                    })
                    .error(function(error) {
                        // Error: registration failed
                        if (error === 'Username already taken') {
                            $scope.usernameError = error;
                        } else {
                            $scope.registerError = error;
                        }
                    });
            };
        }
    ])
    .controller('RestoreCtrl', ['$scope', '$rootScope', '$http', '$state', '$stateParams',
        function($scope, $rootScope, $http, $state, $stateParams) {
            $scope.user = {};
            $scope.restoreSuccess = $scope.restoreError = $scope.hashError = undefined;

            $scope.restore = function() {
                $http.post('/restore', {
                    email: $scope.user.email
                })
                    .success(function(response) {
                        console.log(response);
                        $scope.restoreSuccess = true;
                    })
                    .error(function(error){
                        console.log(error);
                        $scope.restoreError = error;
                    })
                ;
            };

            $scope.initHash = function() {

                $http.get('/restore/' + encodeURIComponent($stateParams.hashId))
                    .success(function(user){
                        $scope.user = user;
                    })
                    .error(function(error){
                        $scope.hashError = true;
                    })
                ;
            };

            $scope.update = function() {
                $http.put('/restore/' + encodeURIComponent($stateParams.hashId), {
                    password: $scope.user.password
                })
                    .success(function(response) {
                        console.log(response);
                        $scope.restoreSuccess = true;
                    })
                    .error(function(error){
                        console.log(error);
                        $scope.restoreError = error;
                    })
                ;
            };
        }
    ])
;