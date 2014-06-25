'use strict';

angular.module('mean.participants').controller('ParticipantsController', ['$scope', '$state', '$stateParams', 'Participants', 'ParticipantStatuses',
    function($scope, $state, $stateParams, Participants, ParticipantStatuses) {

        $scope.package = {
            name: 'participants'
        };

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

        $scope.participant = null;

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

        $scope.confirmParticipation = function (participant) {
            if (participant) {
                participant.confirmed = true;
                participant.$update().then(function () {
                    $scope.find();
                });
            }
        };

        $scope.cancelParticipation = function (participant) {
            if (participant) {
                participant.confirmed = false;
                participant.$update().then(function () {
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
