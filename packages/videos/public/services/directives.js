'use strict';

angular.module('mean.videos')
    .directive('cgVideoDigest', function () {
        return {
            restrict: 'E',
            scope: {
                video: '=data',
                previewUrl: '='
            },
            templateUrl: 'videos/views/digest.html'
        };
    })
;
