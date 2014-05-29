'use strict';

angular.module('mean.system', ['mean.controllers.login', 'mean-factory-interceptor'])
.run(['$rootScope', 'Global', function ($rootScope, Global) {

    $rootScope.global = Global.getWindowGlobals();

    $rootScope.$on('loggedin', function() {
        $rootScope.global = Global.getScopeGlobals($rootScope);
    });

}]);