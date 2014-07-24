'use strict';

angular.module('mean.organizations').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider
            .state('organizations', {
                url: '/organizations',
                templateUrl: 'organizations/views/list.html',
                reload: true
            })
            .state('organizations./', {
                url: '/'
            })
            .state('organizations-create', {
                url:'/organizations/create',
                templateUrl:'organizations/views/edit.html'
            })
            .state('organizations-edit', {
                url: '/organizations/edit/:organizationId',
                templateUrl: 'organizations/views/edit.html'
            })
            .state('organizations-view-list', {
                url: '/organizations/view',
                templateUrl: 'organizations/views/list.html'
            })
            .state('organizations-view-list./', {
                url: '/'
            })
            .state('organizations-view', {
                url: '/organizations/view/:organizationId',
                templateUrl: 'organizations/views/view.html'
            })
            .state('members-organization', {
                url: '/members/organization/:organizationId',
                templateUrl: 'organizations/views/members-organization.html'
            })
        ;

    }
]);
