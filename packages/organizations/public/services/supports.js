'use strict';

angular.module('mean.organizations').factory('Supports' ,['$resource',
    function($resource) {
        return $resource('supports/:supportId', {
            supportId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
