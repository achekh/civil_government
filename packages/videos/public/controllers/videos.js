'use strict';

angular.module('mean').controller('VideosController', ['$scope', '$rootScope', '$stateParams', '$location', 'Videos',
    function($scope, $rootScope, $stateParams, $location, Videos) {

        $scope.videoLiveStatuses = [
            {'value': null, 'label': 'Все відео'},
            {'value': true, 'label': 'Наживо'},
            {'value': false, 'label': 'Архів'}
        ];

        $scope.videoLiveStatus = $scope.videoLiveStatuses.filter(function (status) {
            return '' + status.value === '' + $stateParams.live;
        })[0] || $scope.videoLiveStatuses[0];

        $scope.getPreviewUrl = function (video) {
            return (video) ? video.url : '';
        };

        $scope.getVideoUrl = function (video) {
            return (video) ? video.url : '';
        };

        $scope.add = function() {
            var video = new Videos({
                title: this.title,
                url: this.url,
                live: this.live
            });
            video.$save(function(response) {
                $location.path('videos/' + response._id);
            });

            this.title = '';
            this.url = '';
            this.live = false;
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
            Videos.query({live: $stateParams.live}, function(videos) {
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
