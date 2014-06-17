'use strict';

angular.module('mean.organisations').factory('Members' ,['$resource',
    function($resource) {
        return $resource('members/:memberId', {
            memberId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
