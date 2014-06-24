'use strict';

angular.module('mean.participants').controller('ParticipantsController', ['$scope', '$stateParams', '$state', 'Participants', 'ParticipantStatuses',
    function($scope, $stateParams, $state, Participants, ParticipantStatuses) {

        $scope.package = {
            name: 'participants'
        };

        $scope.coordinator = $stateParams.coordinator;
        $scope.status = $stateParams.status;

        $scope.participantStatuses = ParticipantStatuses;
        $scope.participantStatus = $scope.participantStatuses.filter(function (status) {
            return '' + status.value === '' + $stateParams.status;
        })[0] || $scope.participantStatuses[0];

        $scope.setParticipantStatus = function (status) {
            $scope.participantStatus = status;
            $scope.find();
        };

        $scope.participant = null;

        $scope.find = function () {
            Participants.query({
                activistId: $stateParams.activistId,
                eventId: $stateParams.eventId,
                coordinator: $scope.coordinator,
                status: $scope.participantStatus.value
            }, function (participants) {
                $scope.participants = participants;
            });
        };

        $scope.findOne = function () {
            Participants.get({
                participantId: $stateParams.participantId
            }, function (participant) {
                $scope.participant = participant;
            });
        };

        $scope.findAuthenticated = function () {
            if ($scope.isAuthenticated()) {
                Participants.query({
                    activistId: $scope.global.activist._id,
                    eventId: $stateParams.eventId
                }, function (participants) {
                    if (!participants.errors) {
                        if (participants.length === 1) {
                            $scope.participant = participants[0];
                        }
                    }
                });
            }
        };

        $scope.join = function () {
            var participant = new Participants({
                activist: $scope.global.activist._id,
                event: $stateParams.eventId,
                status: $scope.participantStatuses[1].value
            });
            participant.$save(function () {
                $state.go('events-view', {}, {reload: true});
            });
        };

        $scope.leave = function () {
            $scope.participant.$remove(function() {
                $state.go('events-view', {}, {reload: true});
            });
        };

        $scope.appear = function () {
            if ($scope.participant) {
                $scope.participant.status = $scope.participantStatuses[2].value;
                $scope.participant.$update(function () {
                    $state.go('events-view', {}, {reload: true});
                });
            }
        };

        $scope.load = function (parameters) {
            if (parameters.coordinator === true || parameters.coordinator === false) {
                $scope.coordinator = parameters.coordinator;
            }
            if (parameters.appeared) {
                $scope.appeared = parameters.appeared;
            }
            $scope.find();
        };

    }
]);
