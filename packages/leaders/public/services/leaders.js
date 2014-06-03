'use strict';

angular.module('mean.leaders').factory('Leaders', ['$resource',
    function($resource) {
        return $resource('leaders/:leaderId', {
            leaderId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
//        return {
//            name: 'leaders'
//        };
    }
]);
