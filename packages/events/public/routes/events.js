'use strict';

angular.module('mean.events').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider
            .state('events', {
                url: '/events',

                templateUrl: 'events/views/index.html'
            })
            .state('events create',{
                url:'/events/create',
                controller:'EventsController',
                templateUrl:'events/views/create.html'
            });
    }
]);
