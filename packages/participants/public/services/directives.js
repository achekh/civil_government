'use strict';

angular.module('mean.participants')
    .directive('cgParticipantDigest', function () {
        return {
            restrict: 'E',
            scope: {participant: '=data'},
            templateUrl: 'participants/views/digest.html',
            controller: ['$scope', 'ParticipantStatuses', function ($scope, ParticipantStatuses) {
                $scope.statuses = ParticipantStatuses;
            }]
        };
    })
;
