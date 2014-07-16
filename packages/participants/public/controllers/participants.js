'use strict';

angular.module('mean.participants').controller('ParticipantsController', ['$scope', '$state', '$stateParams', 'Participants', 'ParticipantStatuses', 'Events', 'Members',
    function($scope, $state, $stateParams, Participants, ParticipantStatuses, Events, Members) {

        $scope.package = {
            name: 'participants'
        };

        $scope.eventId = $stateParams.eventId;
        $scope.activistId = $stateParams.activistId;
        $scope.coordinator = $stateParams.coordinator;
        $scope.appeared = $stateParams.appeared;
        $scope.confirmed = $stateParams.confirmed;

        $scope.participantStatuses = ParticipantStatuses;
        $scope.participantStatus = $scope.participantStatuses.getStatus($scope.appeared, $scope.confirmed);

        $scope.setParticipantStatus = function (status) {
            $scope.participantStatus = status;
            $scope.appeared = status.appeared;
            $scope.confirmed = status.confirmed;
            $scope.find();
        };

        $scope.isHead = false;
        if ($stateParams.eventId && $scope.global.activist) {
            Events.get({eventId: $stateParams.eventId}, function (event) {
                if (!event.errors) {
                    Members.query({
                        activistId: $scope.global.activist._id,
                        organizationId: event.organization.id,
                        isLeader: true
                    }, function (members) {
                        if (!members.errors) {
                            $scope.isHead = members.length === 1;
                        }
                    });
                }
            });
        }

        $scope.participants = [];

        $scope.find = function () {
            Participants.query({
                activistId: $stateParams.activistId,
                eventId: $stateParams.eventId,
                coordinator: $scope.coordinator,
                appeared: $scope.appeared,
                confirmed: $scope.confirmed
            }, function (participants) {
                $scope.participants = participants;
            });
        };

        $scope.participant = null;

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
                event: $stateParams.eventId
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
                $scope.participant.appeared = true;
                $scope.participant.$update(function () {
                    $state.go('events-view', {}, {reload: true});
                });
            }
        };

        $scope.toggleConfirmed = function (participant) {
            if (participant) {
                participant.confirmed = !participant.confirmed;
                participant.$update().then(function () {
                    $scope.find();
                });
            }
        };

        $scope.toggleCoordinator = function (participant) {
            if (participant) {
                participant.coordinator = !participant.coordinator;
                participant.$update().finally(function () {
                    $scope.find();
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
            if (parameters.confirmed) {
                $scope.confirmed = parameters.confirmed;
            }
            $scope.find();
        };

    }
]);
