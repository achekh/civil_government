'use strict';

angular.module('mean.events').config(['$stateProvider',
    function($stateProvider) {

        // Check if the user is connected
        var checkLoggedin = function($q, $timeout, $http, $location) {

            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function(user) {
                // Authenticated
                if (user !== '0') $timeout(deferred.resolve);

                // Not Authenticated
                else {
                    $timeout(deferred.reject);
                    $location.url('/login');
                }
            });

            return deferred.promise;

        };

        $stateProvider
            .state('events', {
                url: '/events',
                templateUrl: 'events/views/list.html',
                reload: true
            })
            .state('events-create', {
                url:'/events/create',
                templateUrl:'events/views/edit.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('events-view', {
                url: '/events/:eventId',
                templateUrl: 'events/views/view.html'
            })
            .state('events-edit', {
                url: '/events/edit/:eventId',
                templateUrl: 'events/views/edit.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('events-participants', {
                url: '/events/:eventId/participants',
                templateUrl: 'events/views/participants.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })

        ;
    }
]);
