'use strict';

angular.module('mean.auth')
    .directive('cgLoginWidget', function () {
        return {
            restrict: 'E',
            scope: {
                onloggedin: '='
            },
            templateUrl: 'public/auth/views/login-widget.html',
            link: function ($scope, element, attributes) {
                $scope.$on('loggedin', function () {
                    if (typeof $scope.onloggedin === 'function') {
                        $scope.onloggedin();
                    }
                });
            },
            controller: ['$rootScope', '$scope', function ($rootScope, $scope) {
//                $rootScope.$on('loggedin', function () {
//                    if (typeof $scope.onloggedin === 'function') {
//                        $scope.onloggedin();
//                    }
//                });
            }]
        };
    })
;