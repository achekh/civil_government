'use strict';

angular.module('mean').factory('Videos', ['$resource',
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
