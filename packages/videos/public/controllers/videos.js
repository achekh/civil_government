'use strict';

angular.module('mean.videos').controller('VideosController', ['$scope', '$rootScope', '$stateParams', '$location', 'Videos', 'Events',
    function($scope, $rootScope, $stateParams, $location, Videos, Events) {

        $scope.videoLiveStatuses = [
            {'value': null, 'label': 'Все відео'},
            {'value': true, 'label': 'Наживо'},
            {'value': false, 'label': 'Архів'}
        ];

        $scope.videoLiveStatus = $scope.videoLiveStatuses.filter(function (status) {
            return '' + status.value === '' + $stateParams.live;
        })[0] || $scope.videoLiveStatuses[0];

        $scope.setVideoLiveStatus = function (status) {
            $scope.videoLiveStatus = status;
            $scope.find();
        };

        // YouTube urls:
        // 1) http://youtu.be/xxx
        // 2) http://youtube.com/watch?v=xxx
        // 3) http://youtube.com/embed/xxx
        // Normalize to third
        var youtubeRegExp = /(http|https):\/\/(www\.)?(youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/watch\?).*/i;

        function getYoutubeVideoId(url) {
            var videoId;
            var anchor = document.createElement('a');
            anchor.href = url;
            if (anchor.pathname === '/watch') {
                var parameters = anchor.search.substr(1).split('&');
                videoId = parameters.filter(function (parameter) {
                    return parameter.search('v=') === 0;
                })[0].split('v=')[1];
            } else {
                var path = anchor.pathname.split('/');
                videoId = path[path.length - 1];
            }
            return videoId;
        }

        // ustream urls:
        // 1) http://ustream.tv/channel/xxx
        // 1) http://ustream.tv/embed/xxx
        var ustreamRegExp = /(http|https):\/\/(www\.)?(ustream\.tv\/channel\/|ustream\.tv\/embed\/).*/i;
        function getUstreamVideoId(url) {
            var videoId;
            var anchor = document.createElement('a');
            anchor.href = url;
            var path = anchor.pathname.split('/');
            videoId = path[path.length - 1];
            return videoId;
        }

        $scope.getPreviewUrl = function (video, size) {

            var url = '';
            var options;
            if (size === 'hq') {
                options = {w:480,h:360};
            } else if (size === 'mq') {
                options = {w:320,h:180};
            } else if (size === 'sd') {
                options = {w:640,h:480};
            } else {
                options = {w:120,h:90};
            }

            if (video && video.url) {

                if (youtubeRegExp.test(video.url)) {

                    var imagename = '';

                    if (size === 'hq') {
                        imagename = 'hqdefault.jpg';
                    } else if (size === 'mq') {
                        imagename = 'mqdefault.jpg';
                    } else if (size === 'sd') {
                        imagename = 'sddefault.jpg';
                    } else {
                        imagename = 'default.jpg';
                    }

                    url = $location.protocol() + '://img.youtube.com/vi/' + getYoutubeVideoId(video.url) + '/' + imagename;

                } else if (ustreamRegExp.test(video.url)) {
                    url = $location.protocol() + '://dummyimage.com/' + options.w + 'x' + options.h + '/858585/fff.png&text=ustream.tv';
                } else {
                    url = $location.protocol() + '://dummyimage.com/' + options.w + 'x' + options.h + '/858585/fff.png';
                }

            }

            return url;

        };

        $scope.isValidVideoUrl = function (video) {
            return video && video.url && (youtubeRegExp.test(video.url) || ustreamRegExp.test(video.url));
        };

        $scope.getVideoUrl = function (video) {

            var url = '';

            if (video && video.url) {

                if (youtubeRegExp.test(video.url)) {
                    url = $location.protocol() + '://www.youtube.com/embed/' + getYoutubeVideoId(video.url);
                } else if (ustreamRegExp.test(video.url)) {
                    url = $location.protocol() + '://www.ustream.tv/embed/' + getUstreamVideoId(video.url);
                }

            }

            return url;

        };

        $scope.eventToAddVideo = null;
        $scope.userEvents = null;
        $scope.initAdd = function() {
            Events.query({user: $scope.global.user._id}, function (response) {
                $scope.userEvents = response;
                $scope.eventToAddVideo = $scope.userEvents[0];
            });
        };

        $scope.setEventToAddVideo = function (event) {
            $scope.eventToAddVideo = event;
        };

        $scope.add = function() {

            var video = new Videos({
                title: this.title,
                url: this.url,
                live: this.live,
                event: $scope.eventToAddVideo._id
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
            Videos.query({
                live: $scope.videoLiveStatus.value,
                userId: $stateParams.userId,
                eventId: $stateParams.eventId
            }, function(videos) {
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
]).config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http*://youtube.com**',
        'http*://www.youtube.com**',
        'http*://ustream.tv**',
        'http*://www.ustream.tv**'
    ]);
});
