'use strict';

angular.module('mean.organisations').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider
            .state('organisations', {
                url: '/organisations',
                templateUrl: 'organisations/views/list.html',
                reload: true
            })
            .state('organisations-create', {
                url:'/organisations/create',
                templateUrl:'organisations/views/edit.html'
            })
            .state('organisations-edit', {
                url: '/organisations/edit/:organisationId',
                templateUrl: 'organisations/views/edit.html'
            })
            .state('organisations-view', {
                url: '/organisations/view/:organisationId',
                templateUrl: 'organisations/views/view.html'
            })
        ;

    }
]);
