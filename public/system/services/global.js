'use strict';

//Global service for global variables
angular.module('mean.system').service('Global', ['$rootScope', 'Activists', function ($rootScope, Activists) {

    function isAuthenticated(user) {
        return user && user.roles && user.roles.length > 0;
    }

    function isAdmin(user) {
        return user && user.roles && user.roles.indexOf('admin') > -1;
    }

    function isOwner(user, obj) {
        if (!(user && obj && obj.user)) return false;
        return user._id === obj.user || user._id === obj.user._id;
    }

    function hasAuthorization(user, obj) {
        if (!(user && obj && obj.user)) return false;
        return isAdmin(user) || isOwner(user, obj);
    }

    function populateUserGlobals(globals) {
        if (globals.user && globals.user.roles) {
            globals.authenticated = isAuthenticated(globals.user);
            globals.isAdmin = isAdmin(globals.user);
        }
    }

    function populateActivist(globals) {
        if (globals.user && globals.user._id) {
            Activists.query({userId: globals.user._id}, function (response) {
                if (!response.errors) {
                    globals.activist = response[0];
                }
            });
        }
    }

    this.getGlobals = function (scope) {

        scope = scope || $rootScope;

        var globals = {
            user: scope.user,
            authenticated: false,
            isAdmin: false
        };

        populateUserGlobals(globals);
        populateActivist(globals);

        return globals;

    };

    this.isAuthenticated = isAuthenticated;
    this.isAdmin = isAdmin;
    this.isOwner = isOwner;
    this.hasAuthorization = hasAuthorization;

}]);
