'use strict';

angular.module('mean.organizations').factory('Organizations' ,['$resource',
    function($resource) {
        return $resource('organizations/:organizationId', {
            organizationId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
