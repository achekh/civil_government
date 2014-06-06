'use strict';

angular.module('mean.leaders').factory('Leaders', ['$resource',
    function($resource) {
        return $resource('activists/:activistsId', {
            leaderId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
