'use strict';

angular.module('mean.organizations').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider
            .state('organizations', {
                url: '/organizations',
                templateUrl: 'organizations/views/list.html',
                reload: true
            })
            .state('organizations-create', {
                url:'/organizations/create',
                templateUrl:'organizations/views/edit.html'
            })
            .state('organizations-edit', {
                url: '/organizations/edit/:organizationId',
                templateUrl: 'organizations/views/edit.html'
            })
            .state('organizations-view', {
                url: '/organizations/view/:organizationId',
                templateUrl: 'organizations/views/view.html'
            })
        ;

    }
]);
