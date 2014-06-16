'use strict';

angular.module('mean.events').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider
            .state('events', {
                url: '/events',
                templateUrl: 'events/views/list.html',
                reload: true
            })
            .state('events-create', {
                url:'/events/create',
                templateUrl:'events/views/edit.html'
            })
            .state('events-edit', {
                url: '/events/edit/:eventId',
                templateUrl: 'events/views/edit.html'
            })
            .state('events-view', {
                url: '/events/view/:eventId',
                templateUrl: 'events/views/view.html'
            })
        ;
    }
]);
