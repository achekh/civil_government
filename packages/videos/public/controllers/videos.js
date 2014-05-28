'use strict';

angular.module('mean').controller('VideosController', ['$scope', '$stateParams', '$location', 'Global', 'Videos',
    function($scope, $stateParams, $location, Global, Videos) {
        $scope.global = Global;

        $scope.hasAuthorization = function(video) {
            if (!video || !video.user) return false;
            return $scope.global.isAdmin || video.user._id === $scope.global.user._id;
        };

        $scope.add = function() {
            var video = new Videos({
                title: this.title,
                url: this.url
            });
            video.$save(function(response) {
                $location.path('videos/' + response._id);
            });

            this.title = '';
            this.url = '';
        };

        $scope.remove = function(video) {
            if (video) {
                video.$remove();

                for (var i in $scope.videos) {
                    if ($scope.videos[i] === video) {
                        $scope.videos.splice(i, 1);
                    }
                }
            } else {
                $scope.video.$remove(function(response) {
                    $location.path('videos');
                });
            }
        };

        $scope.update = function() {
            var video = $scope.video;
            if (!video.updated) {
                video.updated = [];
            }
            video.updated.push(new Date().getTime());

            video.$update(function() {
                $location.path('videos/' + video._id);
            });
        };

        $scope.find = function() {
            Videos.query(function(videos) {
                $scope.videos = videos;
            });
        };

        $scope.findOne = function() {
            Videos.get({
                videoId: $stateParams.videoId
            }, function(video) {
                $scope.video = video;
            });
        };
    }
]);
