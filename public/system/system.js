'use strict';

angular.module('mean.system', ['mean.controllers.login', 'mean-factory-interceptor'])
    .run(['$rootScope', 'Global', function ($rootScope, Global) {

        $rootScope.global = Global.getWindowGlobals();

        $rootScope.$on('loggedin', function() {
            $rootScope.global = Global.getScopeGlobals($rootScope);
        });

        function checkGlobalUser() {
            return $rootScope.global && $rootScope.global.user;
        }

        function checkUserObject(obj) {
            return obj && obj.user;
        }

        $rootScope.hasAuthorization = function(obj) {
            if (!checkGlobalUser()) return false;
            if (!checkUserObject(obj)) return false;
            return Global.hasAuthorization($rootScope.global.user, obj);
        };

        $rootScope.isAuthenticated = function () {
            if (!checkGlobalUser()) return false;
            return Global.isAuthenticated($rootScope.global.user);
        };

        $rootScope.isAdmin = function () {
            if (!checkGlobalUser()) return false;
            return Global.isAdmin($rootScope.global.user);
        };

    }])
    .directive('cgDropdownAutoclose', function () {
        return {
            restrict: 'A',
            link: function ($scope, element, atttributes) {
                element.on('click', function (event) {
                    if (event.srcElement && event.srcElement.nodeName === 'A') {
                        element.find('button').eq(0).triggerHandler('click');
                    }
                });
            }
        };
    })
;