'use strict';

angular.module('mean.events').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider
            .state('events', {
                url: '/events',
                templateUrl: 'events/views/list.html',
                reload: true
            })
            .state('events-view', {
                url: '/events/:eventId',
                templateUrl: 'events/views/view.html'
            })
            .state('events-create', {
                url:'/events/create',
                templateUrl:'events/views/create.html'
            });
    }
]);
