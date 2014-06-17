'use strict';

angular.module('mean.system', ['mean.controllers.login', 'mean-factory-interceptor'])
    .run(['$rootScope', 'Global', function ($rootScope, Global) {

        $rootScope.global = Global.getGlobals(window);

        $rootScope.$on('loggedin', function() {
            $rootScope.global = Global.getGlobals($rootScope);
        });

        $rootScope.$on('activist-updated', function(activist) {
            $rootScope.global.activist = activist;
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

        $rootScope.isOwner = function(obj) {
            if (!checkGlobalUser()) return false;
            if (!checkUserObject(obj)) return false;
            return Global.isOwner($rootScope.global.user, obj);
        };

        $rootScope.isAuthenticated = function () {
            if (!checkGlobalUser()) return false;
            return Global.isAuthenticated($rootScope.global.user);
        };

        $rootScope.isAdmin = function () {
            if (!checkGlobalUser()) return false;
            return Global.isAdmin($rootScope.global.user);
        };

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
            toState.previous = fromState;
            if (!toState.previous || !toState.previous.name) {
                toState.previous = toState;
            }
        });

    }])
;