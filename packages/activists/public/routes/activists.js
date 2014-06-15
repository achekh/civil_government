'use strict';

angular.module('mean.activists').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider
            .state('activists', {
                url: '/activists',
                templateUrl: 'activists/views/list.html'
            })
            .state('activists-create', {
                url: '/activists/create',
                templateUrl: 'activists/views/edit.html'
            })
            .state('activists-edit', {
                url: '/activists/edit/:activistId',
                templateUrl: 'activists/views/edit.html'
            })
            .state('activists-view', {
                url: '/activists/view/:activistId',
                templateUrl: 'activists/views/view.html'
            })
            .state('activists-view-self', {
                url: '/activists/view',
                templateUrl: 'activists/views/view.html'
            })

        ;
    }
]);