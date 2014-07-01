'use strict';

angular.module('mean.participants').controller('ParticipantsController', ['$scope', '$state', '$stateParams', 'Participants', 'ParticipantStatuses', 'Events', 'Members',
    function($scope, $state, $stateParams, Participants, ParticipantStatuses, Events, Members) {

        $scope.package = {
            name: 'participants'
        };

        function toBoolean(value) {
            var result;
            if (typeof(value) === 'boolean') {
                result = value;
            } else if (typeof(value) === 'string') {
                if (value.toLowerCase() === 'true') {
                    result = true;
                } else if (value.toLowerCase() === 'false') {
                    result = false;
                }
            }
            return result;
        }

        $scope.eventId = $stateParams.eventId;
        $scope.activistId = $stateParams.activistId;
        $scope.coordinator = toBoolean($stateParams.coordinator);
        $scope.appeared = toBoolean($stateParams.appeared);
        $scope.confirmed = toBoolean($stateParams.confirmed);

        $scope.participantStatuses = ParticipantStatuses;
        $scope.participantStatus = $scope.participantStatuses.getStatus($scope.appeared, $scope.confirmed);

        $scope.setParticipantStatus = function (status) {
            $scope.participantStatus = status;
            $scope.appeared = status.appeared;
            $scope.confirmed = status.confirmed;
            $scope.find();
        };

        // get current actor
        $scope.actor = null;

        if ($scope.global.activist && $stateParams.eventId) {

            var actor = {
                participant: null,
                isParticipant: false,
                isCoordinator: false,
                member: null,
                canParticipate: false,
                isHead: false
            };

            Participants.query({
                activistId: $scope.global.activist._id,
                eventId: $stateParams.eventId
            }, function (participants) {
                if (!participants.errors) {
                    if (participants.length === 1) {

                        actor.participant = participants[0];
                        actor.isParticipant = participants.length === 1;
                        actor.isCoordinator = actor.participant && participants[0].coordinator;

                        Members.query({
                            activistId: $scope.global.activist._id,
                            organizationId: actor.participant.event.organization
                        }, function (members) {
                            if (!members.errors) {
                                if (members.length === 1) {
                                    actor.member = members[0];
                                    actor.canParticipate = true;
                                    actor.isHead = actor.member.isLeader;
                                }
                            }
                            $scope.actor = actor;
                        });

                    }
                }
            });

        }

        // get participants

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

        // get participant

        $scope.participant = null;

        $scope.findOne = function () {
            Participants.get({
                participantId: $stateParams.participantId
            }, function (participant) {
                $scope.participant = participant;
            });
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
            $scope.actor.participant.$remove(function() {
                $state.go('events-view', {}, {reload: true});
            });
        };

        $scope.appear = function () {
            if ($scope.actor.participant) {
                $scope.actor.participant.appeared = true;
                $scope.actor.participant.$update(function () {
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
            if (parameters.confirmed) {
                $scope.confirmed = parameters.confirmed;
            }
            $scope.find();
        };

        $scope.$on('participants-update', function () {
            $scope.find();
        });

    }
]);
