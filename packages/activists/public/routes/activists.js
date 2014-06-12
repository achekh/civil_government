'use strict';

angular.module('mean.activists').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('activist', {
            url: '/activist',
            templateUrl: 'activists/views/index.html'
        });

        //url: '/inbox/:inboxId/messages/{sorted}?from&to'
        // $stateParams: {inboxId: '123', sorted: 'ascending', from: 10, to: 20}

        $stateProvider.state('profile', {
            url: '/profiles/:activistId',
            templateUrl: 'activists/views/profile.html'
        });

        $stateProvider.state('profile_my', {
            url: '/profile',
            templateUrl: 'activists/views/profile.html'
        });
    }
]);