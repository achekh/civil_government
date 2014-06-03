'use strict';

//Global service for global variables
angular.module('mean.system').service('Global', ['$rootScope', function ($rootScope) {

    function isAuthenticated (user) {
        return user && user.roles && user.roles.length > 0;
    }

    function isAdmin (user) {
        return user && user.roles && user.roles.indexOf('admin') > -1;
    }

    function hasAuthorization(user, obj) {
        if (!(user && obj && obj.user)) return false;
        return isAdmin(user) || user._id === obj.user._id;
    }

    function getUserGlobals (scope) {

        var globals = {
            user: scope.user,
            authenticated: false,
            isAdmin: false
        };

        if (scope.user && scope.user.roles) {
            globals.authenticated = isAuthenticated(scope.user);
            globals.isAdmin = isAdmin(scope.user);
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

    this.isAuthenticated = isAuthenticated;
    this.isAdmin = isAdmin;
    this.hasAuthorization = hasAuthorization;

}]);
