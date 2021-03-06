'use strict';

angular.module('mean.videos').config(['$stateProvider',
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
            .state('videos', {
                url: '/videos?live&userId&eventId',
                templateUrl: 'videos/views/list.html'
            })
            .state('videos-add', {
                url: '/videos/add',
                templateUrl: 'videos/views/add.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('videos-view', {
                url: '/videos/:videoId',
                templateUrl: 'videos/views/view.html'
            })
            .state('videos-edit', {
                url: '/videos/:videoId/edit',
                templateUrl: 'videos/views/edit.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
        ;
    }
]);
