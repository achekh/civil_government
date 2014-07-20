'use strict';

angular.module('mean.events')
    .factory('EventStatuses',
        function () {

            var statuses = [
                {value:'FOR_APPROVAL', label:'На затвердженні'},
                {value:'APPROVED', label:'Затверджено'},
                {value:'AGREED', label:'Узгоджено'},
                {value:'STARTED', label:'Розпочато'},
                {value:'FINISHED', label:'Закінчено'},
                {value:'CANCELED', label:'Відмінено'},
                {value:'DEFEATED', label:'Поразка'},
                {value:'WON', label:'Перемога'}
            ];

            function getLabel (value) {
                var status = statuses.filter(function (status) {
                    return status.value === value;
                })[0];
                return status ? status.label : status;
            }

            statuses.getLabel = getLabel;

            statuses.forEach(function (status) {
                statuses[status.value] = status.value;
            });

            return statuses;

        }
    )
;
