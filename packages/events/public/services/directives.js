'use strict';

angular.module('mean.events')
    .directive('cgEventDigest', function () {
        return {
            restrict: 'E',
            scope: {event: '=data'},
            templateUrl: 'events/views/digest.html',
            controller: ['$scope', 'EventStatuses', function ($scope, EventStatuses) {
                $scope.getLabel = EventStatuses.getLabel;
            }]
        };
    })
;
