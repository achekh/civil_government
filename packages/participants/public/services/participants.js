'use strict';

angular.module('mean.participants')
    .factory('Participants', ['$resource', function($resource) {
        return $resource('participants/:participantId', {
            participantId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }])
    .factory('ParticipantStatuses', function () {

        var statuses = [
            {value: null, label: 'Всі'},
            {value:'GOING', label: 'Піде'},
            {value:'APPEAR', label: 'Прийшов'},
            {value:'PARTICIPATED', label: 'Взяв участь'}
        ];

        function getLabel (value) {
            var status = statuses.filter(function (status) {
                return status.value === value;
            })[0];
            return status ? status.label : status;
        }


        statuses.getLabel = getLabel;

        return statuses;

    })
;
