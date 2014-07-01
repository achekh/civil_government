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
    .directive('cgParticipantActions', function () {
        return {
            restrict: 'E',
            scope: {
                participant: '=',
                actor: '='
            },
            templateUrl: 'participants/views/actions.html',
            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {

                $scope.toggleConfirmed = function (participant) {
                    if (participant) {
                        participant.confirmed = !participant.confirmed;
                        participant.$update().then(function () {
                            $rootScope.$broadcast('participants-update');
                        });
                    }
                };

                $scope.toggleCoordinator = function (participant) {
                    if (participant) {
                        participant.coordinator = !participant.coordinator;
                        participant.$update().finally(function () {
                            $rootScope.$broadcast('participants-update');
                        });
                    }
                };
            }]
        };
    })
;
