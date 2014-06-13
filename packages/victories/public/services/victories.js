'use strict';

angular
    .module('mean.victories')
    .factory('Victories',
    ['$resource',
    function($resource) {
        return $resource('victories/:victoryId', {
            victoryId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
