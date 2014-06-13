'use strict';

angular.module('mean.participants').factory('Participants', ['$resource',
    function($resource) {
        return $resource('participants/:participantId', {
            participantId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
