'use strict';

//Activists service used for activists REST endpoint
angular.module('mean.activists').factory('Activists', ['$resource',
    function($resource) {
        return $resource('activists/:activistId', {
            activistId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
