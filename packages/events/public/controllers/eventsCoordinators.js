'use strict';

angular.module('mean.events').controller('EventsCoordinatorsController', ['$scope', '$stateParams', '$location', '$state', 'Events', 'EventStatuses', 'Activists', 'Participants', 'Members',
    function ($scope, $stateParams, $location, $state, Events, EventStatuses, Activists, Participants, Members) {

        $scope.event = null;
        $scope.members = [];
        $scope.participants = [];

        $scope.find = function () {

            return Events.get({
                eventId: $stateParams.eventId
            }, function (event) {

                $scope.event = event;

                if ($scope.event) {

                    Members.query({organizationId: $scope.event.organization._id}, function (members) {
                        if (!members.errors) {
                            $scope.members = members;
                        }
                    });

                    Participants.query({eventId: $scope.event._id}, function (participants) {
                        if (!participants.errors) {
                            $scope.participants = participants;
                        }
                    });

                }

            });

        };

        $scope.isHead = function () {
            return $scope.event && $scope.isOwner($scope.event.organization);
        };

        $scope.isCoordinator = function (activist) {
            return $scope.participants && $scope.participants.some(function (parcitipant) {
                return parcitipant.coordinator && parcitipant.activist._id === activist._id;
            });
        };

        $scope.toggleCoordinator = function (activist) {
            if (activist) {
                var participant = $scope.participants.filter(function (participant) {
                    return participant.activist._id === activist._id;
                })[0];
                if (participant) {
                    participant.coordinator = !participant.coordinator;
                    participant.$update().finally(function () {
                        $scope.find();
                    });
                }
            }
        };

    }
]);