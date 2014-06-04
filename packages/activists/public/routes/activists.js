'use strict';

angular.module('mean.activists').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('activists example page', {
            url: '/activist',
            templateUrl: 'activists/views/index.html'
        });
    }
]);