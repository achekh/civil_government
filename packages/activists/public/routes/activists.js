'use strict';

angular.module('mean.activists').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('activist', {
            url: '/activist',
            templateUrl: 'activists/views/index.html'
        });
    }
]);