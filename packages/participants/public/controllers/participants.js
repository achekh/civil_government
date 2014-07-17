'use strict';

angular.module('mean.participants').controller('ParticipantsController', ['$scope', '$rootScope', '$stateParams', 'Participants', 'ParticipantStatuses', 'Actor',
    function($scope, $rootScope, $stateParams, Participants, ParticipantStatuses, Actor) {

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
        function getActor () {
            Actor.getActor().then(function (actor) {
                $scope.actor = actor;
            });
        }

        $scope.actor = {};
        getActor();

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
                activist: $scope.actor.activist._id,
                event: $stateParams.eventId
            });
            participant.$save(function () {
                $rootScope.$broadcast('participants-update');
            });
        };

        $scope.leave = function () {
            $scope.actor.participant.$remove(function() {
                $rootScope.$broadcast('participants-update');
            });
        };

        $scope.appear = function () {
            if ($scope.actor.participant) {
                $scope.actor.participant.appeared = true;
                $scope.actor.participant.$update(function () {
                    $rootScope.$broadcast('participants-update');
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
            getActor();
            $scope.find();
        });

    }
]);
