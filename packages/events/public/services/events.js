'use strict';

angular.module('mean.events')
    .factory('Events' ,['$resource',
        function($resource) {
            return $resource('events/:eventId', {
                eventId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            });
        }
    ])
    .factory('EventStatuses',
        function () {

            var statuses = [
                {value:'FOR_APPROVAL', label:'На затвердженні'},
                {value:'APPROVED', label:'Затверджено'},
                {value:'AGREED', label:'Узгоджено'},
                {value:'IN_PROGRESS', label:'В процесі'},
                {value:'FINISHED', label:'Закінчено'},
                {value:'CANCELED', label:'Відмінено'},
                {value:'WIN', label:'Перемога'}
            ];

            function getLabel (value) {
                var status = statuses.filter(function (status) {
                    return status.value === value;
                })[0];
                return status ? status.label : status;
            }


            statuses.getLabel = getLabel;

            return statuses;

        }
    )
;
