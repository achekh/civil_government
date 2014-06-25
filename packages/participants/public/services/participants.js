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
            {value:'GOING', label: 'Піде', appeared: false},
            {value:'APPEARED', label: 'Прийшов', appeared: true, confirmed: false},
            {value:'CONFIRMED', label: 'Взяв участь', confirmed: true}
        ];

        function getLabel (value) {
            var status = statuses.filter(function (status) {
                return status.value === value;
            })[0];
            return status ? status.label : status;
        }

        function getStatus (appeared, confirmed) {
            return statuses.filter(function (status) {
                return (status.hasOwnProperty('appeared') ? status.appeared === appeared : true) &&
                    (status.hasOwnProperty('confirmed') ? status.confirmed === confirmed : true);
            })[0];
        }

        statuses.getLabel = getLabel;
        statuses.getStatus = getStatus;

        return statuses;

    })
;
