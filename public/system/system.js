'use strict';

angular.module('mean.system', ['mean-factory-interceptor'])
    .run(['$rootScope', '$state', 'Global', function ($rootScope, $state, Global) {

        $rootScope.global = Global.getGlobals(window);

        $rootScope.$on('loggedin', function() {
            $rootScope.global = Global.getGlobals($rootScope);
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

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (toState.authenticate && !$rootScope.global.authenticated) {
                event.preventDefault();
            }
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            toState.previous = fromState;
            toState.previousParams = fromParams;
        });

        $state.goBack = function goBack() {
            if (!$state.current.previous || !$state.current.previous.name) {
                $state.go('home');
            } else {
                $state.go($state.current.previous, $state.current.previousParams);
            }
        };

        $rootScope.fileServerUrl = 'http://77.91.132.7:3001/';

    }])
;