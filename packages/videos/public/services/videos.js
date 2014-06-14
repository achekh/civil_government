'use strict';

angular.module('mean.videos').factory('Videos', ['$resource',
    function($resource) {
        return $resource('videos/:videoId', {
            videoId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
