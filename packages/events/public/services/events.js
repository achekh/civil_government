'use strict';

angular.module('mean.events').factory('Events' ,['$resource',
    function($resource) {
        return $resource('events/:eventsId', {
            eventsId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
