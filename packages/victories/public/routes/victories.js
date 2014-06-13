'use strict';

angular.module('mean.victories').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('victories', {
            url: '/victories',
            templateUrl: 'victories/views/index.html'
        });
    }
]);
