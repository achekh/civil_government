'use strict';

//Global service for global variables
angular.module('mean.system').service('Global', ['$rootScope', function ($rootScope) {

    function getUserGlobals (scope) {

        var globals = {
            user: scope.user,
            authenticated: false,
            isAdmin: false
        };

        if (scope.user && scope.user.roles) {
            globals.authenticated = scope.user.roles.length > 0;
            globals.isAdmin = scope.user.roles.indexOf('admin') > -1;
        }

        return globals;

    }

    this.getWindowGlobals = function () {
        var globals = getUserGlobals(window);
        return globals;
    };

    this.getScopeGlobals = function (scope) {
        scope = scope || $rootScope;
        var globals = getUserGlobals(scope);
        return globals;
    };

}]);
