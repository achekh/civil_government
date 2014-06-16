'use strict';

angular.module('mean.participants').controller('ParticipantsController', ['$scope', '$stateParams', '$state', 'Participants',
    function($scope, $stateParams, $state, Participants) {

        $scope.package = {
            name: 'participants'
        };

        $scope.coordinator = $stateParams.coordinator;
        $scope.appeared = $stateParams.appeared;

        $scope.find = function () {
            Participants.query({
                activistId: $stateParams.activistId,
                eventId: $stateParams.eventId,
                coordinator: $scope.coordinator,
                appeared: $scope.appeared
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
            if ($scope.global.authenticated) {
                Participants.query({
                    userId: $scope.global.user._id,
                    eventId: $stateParams.eventId
                }, function (participants) {
                    $scope.participant = participants[0];
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

        $scope.load = function (parameters) {
            if (parameters.coordinator) {
                $scope.coordinator = parameters.coordinator;
            }
            if (parameters.appeared) {
                $scope.appeared = parameters.appeared;
            }
            $scope.find();
        };

    }
]);
