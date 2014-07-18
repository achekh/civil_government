'use strict';

angular.module('mean').config(['$stateProvider',
    function($stateProvider) {

        // Check if the user is connected
//        var checkLoggedin = function($q, $timeout, $http, $location) {
//
//            // Initialize a new promise
//            var deferred = $q.defer();
//
//            // Make an AJAX call to check if the user is logged in
//            $http.get('/loggedin').success(function(user) {
//                // Authenticated
//                if (user !== '0') $timeout(deferred.resolve);
//
//                // Not Authenticated
//                else {
//                    $timeout(deferred.reject);
//                    $location.url('/login');
//                }
//            });
//
//            return deferred.promise;
//
//        };

        $stateProvider
            .state('participants', {
                url: '/participants?activistId&eventId',
                templateUrl: 'participants/views/list.html'
            })
//            .state('participants-view', {
//                url: '/participants/:participantId',
//                templateUrl: 'participants/views/view.html'
//            })
            .state('participants-event', {
                url: '/participants/event/:eventId?coordinator',
                templateUrl: 'participants/views/event.html'
            })
            .state('participants-activist', {
                url: '/participants/activist/:activistId',
                templateUrl: 'participants/views/activist.html'
            })
        ;
    }
]);
